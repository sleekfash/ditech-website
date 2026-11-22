import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { ThemeToggle } from "@/components/ThemeToggle";
import ditechLogo from "@/assets/ditech-logo.jpeg";

type AuthMode = "signin" | "signup";

function isVerifiedUser(user: User | null | undefined) {
  return Boolean(user?.email_confirmed_at || user?.confirmed_at);
}

function safeLocalPath(path: string | null) {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : null;
}

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode: AuthMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const destination = safeLocalPath(searchParams.get("next")) ?? (mode === "signup" ? "/" : "/admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDestination = safeLocalPath(window.sessionStorage.getItem("ditech-auth-next"));
    if (!storedDestination) return;

    let active = true;
    const redirectIfVerified = (user: User | null | undefined) => {
      if (!active || !isVerifiedUser(user)) return;
      window.sessionStorage.removeItem("ditech-auth-next");
      navigate(storedDestination, { replace: true });
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      redirectIfVerified(session?.user);
    });
    void supabase.auth.getUser().then(({ data, error: userError }) => {
      if (!userError) redirectIfVerified(data.user);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const changeMode = (nextMode: AuthMode) => {
    setError("");
    setConfirmationSent(false);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("mode", nextMode);
    setSearchParams(nextParams, { replace: true });
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy("email");
    setError("");
    setConfirmationSent(false);

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });

        if (signUpError) {
          setError("We couldn't create the account. Check your details and try again.");
          return;
        }

        if (data.session && isVerifiedUser(data.user)) {
          navigate(destination, { replace: true });
          return;
        }
        if (data.session) await supabase.auth.signOut();
        setPassword("");
        setConfirmationSent(true);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError("We couldn't sign you in. Check your email, password, and confirmation status.");
        return;
      }

      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !isVerifiedUser(data.user)) {
        await supabase.auth.signOut();
        setError("Confirm your email before signing in.");
        return;
      }
      navigate(destination, { replace: true });
    } catch {
      setError(mode === "signup" ? "We couldn't create the account. Please try again." : "We couldn't sign you in. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const handleGoogle = async () => {
    if (busy) return;
    setBusy("google");
    setError("");
    window.sessionStorage.setItem("ditech-auth-next", destination);

    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth`,
      });
      if (result.error) {
        window.sessionStorage.removeItem("ditech-auth-next");
        setError("Google sign-in is temporarily unavailable. Please try email instead.");
        return;
      }
      if (result.redirected) return;

      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !isVerifiedUser(data.user)) {
        window.sessionStorage.removeItem("ditech-auth-next");
        setError("A verified Google account is required to continue.");
        return;
      }
      window.sessionStorage.removeItem("ditech-auth-next");
      navigate(destination, { replace: true });
    } catch {
      window.sessionStorage.removeItem("ditech-auth-next");
      setError("Google sign-in is temporarily unavailable. Please try email instead.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <Button asChild variant="link" className="mb-4 h-auto px-0 text-muted-foreground">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />Back to DiTech</Link>
        </Button>
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <img src={ditechLogo} alt="DiTech" width={64} height={64} className="h-16 w-16 rounded-xl object-cover" />
            </div>
            <CardTitle className="font-display text-2xl">Your DiTech account</CardTitle>
            <CardDescription>
              Sign in or create an account to receive workflow recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-1 rounded-md bg-muted p-1" role="group" aria-label="Account action">
              <Button type="button" variant={mode === "signin" ? "default" : "ghost"} aria-pressed={mode === "signin"} onClick={() => changeMode("signin")}>
                Sign in
              </Button>
              <Button type="button" variant={mode === "signup" ? "default" : "ghost"} aria-pressed={mode === "signup"} onClick={() => changeMode("signup")}>
                Create account
              </Button>
            </div>

            {confirmationSent ? (
              <div className="space-y-3 rounded-md border border-border bg-muted/50 p-4 text-center" role="status" aria-live="polite">
                <MailCheck className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
                <p className="font-medium">Check your email for a verification link.</p>
                <p className="text-sm text-muted-foreground">Confirm your address before signing in and requesting a workflow review.</p>
                <Button type="button" variant="outline" onClick={() => changeMode("signin")}>
                  Return to sign in
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={busy !== null}>
                  {busy === "email" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Please wait…</> : mode === "signup" ? "Create account" : "Sign in"}
                </Button>
              </form>
            )}

            {!confirmationSent && (
              <>
                <div className="relative flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  <span>or</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <Button type="button" variant="outline" onClick={handleGoogle} disabled={busy !== null} className="h-11 w-full gap-[10px] bg-card text-card-foreground">
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
                    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
                    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
                  </svg>
                  {busy === "google" ? "Connecting to Google…" : "Continue with Google"}
                </Button>
              </>
            )}

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Email accounts require confirmation. No additional profile details are collected. Workflow reviews are limited to three per UTC day.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
