import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";

type AdminUser = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  is_self: boolean;
};

const UsersPanel = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "list" },
    });
    setLoading(false);
    const payload = data as { users?: AdminUser[]; error?: string } | null;
    if (error || !payload?.users) {
      toast({
        title: "Could not load accounts",
        description: payload?.error ?? "Please try again.",
        variant: "destructive",
      });
      return;
    }
    setUsers(payload.users);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAdmin = async (user: AdminUser, next: boolean) => {
    const question = next
      ? `Give ${user.email} full administrator access?`
      : `Remove administrator access from ${user.email}?`;
    if (!confirm(question)) return;

    setBusy(user.user_id);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "set_admin", user_id: user.user_id, is_admin: next },
    });
    setBusy(null);

    const payload = data as { success?: boolean; error?: string } | null;
    if (error || !payload?.success) {
      toast({
        title: "Change not saved",
        description: payload?.error ?? "Please try again.",
        variant: "destructive",
      });
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.user_id === user.user_id ? { ...u, is_admin: next } : u))
    );
    toast({ title: next ? "Administrator added" : "Administrator access removed" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-4 w-4" aria-hidden="true" />
          Accounts
        </CardTitle>
        <CardDescription>
          Everyone registered on the site. Administrators can reach this dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-0 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading accounts…</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No accounts found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="hidden sm:table-cell">Name</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead className="text-right">Administrator</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.user_id}>
                  <TableCell className="font-medium">
                    {u.email ?? "—"}
                    {u.is_self && (
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        You
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{u.full_name ?? "—"}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(u.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={u.is_admin}
                      disabled={u.is_self || busy === u.user_id}
                      onCheckedChange={(v) => toggleAdmin(u, v)}
                      aria-label={`Administrator access for ${u.email ?? "this account"}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersPanel;
