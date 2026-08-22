import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot, BookOpen, SlidersHorizontal, MessagesSquare, Send, Plus, Trash2,
  Rocket, History, Flag, Hand, Loader2, RotateCcw,
} from "lucide-react";

// The generated supabase types don't include these tables yet; cast per-query.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

interface BotConfig {
  id: string;
  status: "draft" | "published" | "archived";
  version: number;
  bot_name: string;
  tagline: string;
  greeting: string;
  tone: string;
  response_length: string;
  system_instructions: string;
  guardrails: string;
  starter_prompts: string[];
  model: string;
  temperature: number;
  max_tokens: number;
  use_product_context: boolean;
  log_transcripts: boolean;
  always_cta: boolean;
  created_at: string;
}

interface KnowledgeItem {
  id: string;
  label: string;
  question: string;
  answer: string;
  priority: number;
  enabled: boolean;
}

interface ChatLog {
  id: string;
  session_id: string;
  first_question: string | null;
  message_count: number;
  flagged: boolean;
  lead: boolean;
  admin_notes: string | null;
  created_at: string;
}

const MODEL_OPTIONS = [
  { value: "google/gemini-3.7-flash", label: "Gemini 3.7 Flash (default)" },
  { value: "google/gemini-3.5-flash", label: "Gemini 3.5 Flash" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite (cheapest)" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro (strongest reasoning)" },
];

const EMPTY_FORM = {
  bot_name: "Orcka",
  tagline: "DiTech's AI assistant",
  greeting: "Hi, I'm Orcka. Ask me about our AI, automation and legal-tech work — or tell me what you're trying to build.",
  tone: "professional",
  response_length: "medium",
  system_instructions: "",
  guardrails: "Politely redirect anything unrelated to DiTech. Never invent prices, SKUs or delivery dates.",
  starter_prompts: [
    "Tell me about your services",
    "What is your legal tech solution?",
    "How does AI automation work?",
    "I want to discuss a project",
  ] as string[],
  model: "google/gemini-3.7-flash",
  temperature: 0.6,
  max_tokens: 900,
  use_product_context: true,
  log_transcripts: true,
  always_cta: false,
};

type FormState = typeof EMPTY_FORM;

const OrckaAdmin = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [published, setPublished] = useState<BotConfig | null>(null);
  const [versions, setVersions] = useState<BotConfig[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewInput, setPreviewInput] = useState("");
  const [previewReply, setPreviewReply] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [openLog, setOpenLog] = useState<ChatLog | null>(null);
  const [logMessages, setLogMessages] = useState<{ id: string; role: string; content: string; created_at: string }[]>([]);
  const [newItem, setNewItem] = useState({ label: "", question: "", answer: "" });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const load = useCallback(async () => {
    const [{ data: configs }, { data: kb }, { data: cl }] = await Promise.all([
      db.from("bot_config").select("*").order("version", { ascending: false }),
      db.from("bot_knowledge").select("*").order("priority", { ascending: true }),
      db.from("chat_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    const all = (configs ?? []) as BotConfig[];
    setVersions(all);
    const live = all.find((c) => c.status === "published") ?? null;
    setPublished(live);
    const draft = all.find((c) => c.status === "draft");
    const source = draft ?? live;
    if (source) {
      setForm({
        bot_name: source.bot_name,
        tagline: source.tagline,
        greeting: source.greeting,
        tone: source.tone,
        response_length: source.response_length,
        system_instructions: source.system_instructions,
        guardrails: source.guardrails,
        starter_prompts: Array.isArray(source.starter_prompts) ? source.starter_prompts : [],
        model: source.model,
        temperature: Number(source.temperature),
        max_tokens: source.max_tokens,
        use_product_context: source.use_product_context,
        log_transcripts: source.log_transcripts,
        always_cta: source.always_cta,
      });
    }
    setKnowledge((kb ?? []) as KnowledgeItem[]);
    setLogs((cl ?? []) as ChatLog[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveDraft = async () => {
    setSaving(true);
    try {
      const nextVersion = (versions[0]?.version ?? 0) + 1;
      const existing = versions.find((v) => v.status === "draft");
      if (existing) {
        await db.from("bot_config").delete().eq("id", existing.id);
      }
      const { error } = await db.from("bot_config").insert({ ...form, status: "draft", version: nextVersion });
      if (error) throw error;
      toast({ title: "Draft saved", description: `Version ${nextVersion} saved as a draft.` });
      await load();
    } catch (e) {
      toast({ title: "Could not save draft", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    setPublishing(true);
    try {
      if (published) {
        await db.from("bot_config").update({ status: "archived" }).eq("id", published.id);
      }
      const nextVersion = (versions[0]?.version ?? 0) + 1;
      const { error } = await db.from("bot_config").insert({ ...form, status: "published", version: nextVersion });
      if (error) throw error;
      toast({ title: "Published", description: `Version ${nextVersion} is now live for visitors.` });
      await load();
    } catch (e) {
      toast({ title: "Publish failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  const rollback = async (version: BotConfig) => {
    if (published) {
      await db.from("bot_config").update({ status: "archived" }).eq("id", published.id);
    }
    const nextVersion = (versions[0]?.version ?? 0) + 1;
    const { id: _id, status: _s, created_at: _c, ...rest } = version;
    await db.from("bot_config").insert({ ...rest, status: "published", version: nextVersion });
    toast({ title: "Rolled back", description: `Now live as version ${nextVersion}.` });
    setHistoryOpen(false);
    await load();
  };

  const runPreview = async () => {
    if (!previewInput.trim() || previewLoading) return;
    setPreviewLoading(true);
    setPreviewReply("");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: previewInput.trim() }],
            previewConfig: { ...form },
          }),
        }
      );
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || "Preview failed");
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let buffer = "";
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let i: number;
        while ((i = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, i);
          buffer = buffer.slice(i + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              reply += delta;
              setPreviewReply(reply);
            }
          } catch { /* partial */ }
        }
      }
    } catch (e) {
      setPreviewReply(`⚠️ ${e instanceof Error ? e.message : "Preview failed"}`);
    } finally {
      setPreviewLoading(false);
    }
  };

  const addKnowledge = async () => {
    if (!newItem.label.trim() || !newItem.answer.trim()) return;
    const { error } = await db.from("bot_knowledge").insert({
      label: newItem.label.trim(),
      question: newItem.question.trim(),
      answer: newItem.answer.trim(),
    });
    if (error) {
      toast({ title: "Could not add snippet", description: error.message, variant: "destructive" });
      return;
    }
    setNewItem({ label: "", question: "", answer: "" });
    await load();
  };

  const toggleKnowledge = async (item: KnowledgeItem) => {
    await db.from("bot_knowledge").update({ enabled: !item.enabled }).eq("id", item.id);
    await load();
  };

  const deleteKnowledge = async (id: string) => {
    await db.from("bot_knowledge").delete().eq("id", id);
    await load();
  };

  const openTranscript = async (log: ChatLog) => {
    setOpenLog(log);
    const { data } = await db
      .from("chat_log_messages")
      .select("id, role, content, created_at")
      .eq("log_id", log.id)
      .order("created_at", { ascending: true });
    setLogMessages(data ?? []);
  };

  const toggleFlag = async (log: ChatLog) => {
    await db.from("chat_logs").update({ flagged: !log.flagged }).eq("id", log.id);
    await load();
    if (openLog?.id === log.id) setOpenLog({ ...log, flagged: !log.flagged });
  };

  const analytics = useMemo(() => {
    const now = Date.now();
    const dayMs = 86400000;
    const days: { label: string; count: number }[] = [];
    for (let d = 13; d >= 0; d--) {
      const start = new Date(now - d * dayMs);
      const key = start.toISOString().slice(0, 10);
      days.push({
        label: start.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        count: logs.filter((l) => l.created_at.slice(0, 10) === key).length,
      });
    }
    const maxCount = Math.max(1, ...days.map((d) => d.count));
    const openingCounts = new Map<string, number>();
    logs.forEach((l) => {
      if (l.first_question) {
        const key = l.first_question.slice(0, 60);
        openingCounts.set(key, (openingCounts.get(key) ?? 0) + 1);
      }
    });
    const topOpenings = [...openingCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return {
      total: logs.length,
      messages: logs.reduce((sum, l) => sum + l.message_count, 0),
      flagged: logs.filter((l) => l.flagged).length,
      leads: logs.filter((l) => l.lead).length,
      days,
      maxCount,
      topOpenings,
    };
  }, [logs]);

  return (
    <Tabs defaultValue="persona" className="space-y-6">
      <TabsList className="flex-wrap h-auto">
        <TabsTrigger value="persona" className="gap-2">
          <Bot className="h-4 w-4" aria-hidden="true" /> Persona
        </TabsTrigger>
        <TabsTrigger value="knowledge" className="gap-2">
          <BookOpen className="h-4 w-4" aria-hidden="true" /> Knowledge
        </TabsTrigger>
        <TabsTrigger value="model" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Model
        </TabsTrigger>
        <TabsTrigger value="transcripts" className="gap-2">
          <MessagesSquare className="h-4 w-4" aria-hidden="true" /> Transcripts
        </TabsTrigger>
      </TabsList>

      {/* ---------------- Persona ---------------- */}
      <TabsContent value="persona" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Persona & instructions</CardTitle>
              <CardDescription>
                How {form.bot_name} introduces itself and behaves.
                {published && (
                  <span className="ml-2 inline-flex items-center gap-1">
                    <Badge variant="secondary">Live: v{published.version}</Badge>
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bot-name">Bot name</Label>
                  <Input id="bot-name" value={form.bot_name} onChange={(e) => set("bot_name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bot-tagline">Tagline</Label>
                  <Input id="bot-tagline" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bot-greeting">Greeting (welcome screen)</Label>
                <Textarea id="bot-greeting" rows={2} value={form.greeting} onChange={(e) => set("greeting", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={form.tone} onValueChange={(v) => set("tone", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="consultative">Consultative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Response length</Label>
                  <Select value={form.response_length} onValueChange={(v) => set("response_length", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bot-instructions">System instructions (overrides the built-in prompt)</Label>
                <Textarea
                  id="bot-instructions"
                  rows={8}
                  placeholder="Leave empty to use the built-in DiTech prompt…"
                  value={form.system_instructions}
                  onChange={(e) => set("system_instructions", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bot-guardrails">Guardrails (things to refuse or redirect)</Label>
                <Textarea id="bot-guardrails" rows={3} value={form.guardrails} onChange={(e) => set("guardrails", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Starter prompts</Label>
                {form.starter_prompts.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={p}
                      onChange={(e) => {
                        const next = [...form.starter_prompts];
                        next[i] = e.target.value;
                        set("starter_prompts", next);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove starter prompt ${i + 1}`}
                      onClick={() => set("starter_prompts", form.starter_prompts.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => set("starter_prompts", [...form.starter_prompts, ""])}
                >
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Add prompt
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Always end with a call-to-action</p>
                  <p className="text-xs text-muted-foreground">Closes each reply with a next step (book a call / contact form).</p>
                </div>
                <Switch checked={form.always_cta} onCheckedChange={(v) => set("always_cta", v)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live preview</CardTitle>
              <CardDescription>
                Test the draft instructions before publishing. Only admins can run previews.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask something as a visitor would…"
                  value={previewInput}
                  onChange={(e) => setPreviewInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runPreview()}
                />
                <Button onClick={runPreview} disabled={previewLoading || !previewInput.trim()}>
                  {previewLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Send className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
              <div className="min-h-40 rounded-lg border bg-muted/40 p-4 text-sm whitespace-pre-wrap">
                {previewReply || <span className="text-muted-foreground">The reply will appear here…</span>}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" onClick={saveDraft} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  Save draft
                </Button>
                <Button onClick={publish} disabled={publishing} className="gradient-bg">
                  {publishing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Rocket className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
                  Publish live
                </Button>
                <Button variant="ghost" onClick={() => setHistoryOpen(true)}>
                  <History className="mr-2 h-4 w-4" aria-hidden="true" /> Versions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* ---------------- Knowledge ---------------- */}
      <TabsContent value="knowledge" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Knowledge snippets & FAQ</CardTitle>
            <CardDescription>
              Enabled snippets are injected into every reply as verified facts. Lower priority number = earlier in the prompt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 rounded-lg border p-4 md:grid-cols-[1fr_1fr_2fr_auto]">
              <Input placeholder="Label (e.g. Pricing)" value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })} />
              <Input placeholder="Question (optional)" value={newItem.question} onChange={(e) => setNewItem({ ...newItem, question: e.target.value })} />
              <Input placeholder="Answer / fact" value={newItem.answer} onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })} />
              <Button onClick={addKnowledge} disabled={!newItem.label.trim() || !newItem.answer.trim()}>
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="divide-y rounded-lg border">
              {knowledge.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">No snippets yet. Add one above.</p>
              )}
              {knowledge.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4">
                  <Switch checked={item.enabled} onCheckedChange={() => toggleKnowledge(item)} aria-label={`Enable ${item.label}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {item.label}
                      <span className="ml-2 text-xs text-muted-foreground">priority {item.priority}</span>
                    </p>
                    {item.question && <p className="text-xs text-muted-foreground">Q: {item.question}</p>}
                    <p className="mt-1 text-sm text-muted-foreground break-words">{item.answer}</p>
                  </div>
                  <Button variant="ghost" size="icon" aria-label={`Delete ${item.label}`} onClick={() => deleteKnowledge(item.id)}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ---------------- Model ---------------- */}
      <TabsContent value="model" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Model & creativity</CardTitle>
            <CardDescription>Changes apply on publish.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Model</Label>
                <Select value={form.model} onValueChange={(v) => set("model", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MODEL_OPTIONS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max response length (tokens)</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  min={100}
                  max={8000}
                  value={form.max_tokens}
                  onChange={(e) => set("max_tokens", Number(e.target.value) || 900)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Creativity (temperature): {form.temperature.toFixed(1)}</Label>
              <input
                id="temperature"
                type="range"
                min={0}
                max={1.5}
                step={0.1}
                value={form.temperature}
                onChange={(e) => set("temperature", Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground">Lower = more factual and consistent. Higher = more varied phrasing.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Product catalog awareness</p>
                  <p className="text-xs text-muted-foreground">Let {form.bot_name} recommend items from the shop.</p>
                </div>
                <Switch checked={form.use_product_context} onCheckedChange={(v) => set("use_product_context", v)} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Transcript logging</p>
                  <p className="text-xs text-muted-foreground">Store conversations server-side for review (admin-only access).</p>
                </div>
                <Switch checked={form.log_transcripts} onCheckedChange={(v) => set("log_transcripts", v)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveDraft} disabled={saving}>Save draft</Button>
              <Button onClick={publish} disabled={publishing} className="gradient-bg">
                <Rocket className="mr-2 h-4 w-4" aria-hidden="true" /> Publish live
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ---------------- Transcripts ---------------- */}
      <TabsContent value="transcripts" className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Conversations", value: analytics.total },
            { label: "Messages", value: analytics.messages },
            { label: "Flagged answers", value: analytics.flagged },
            { label: "Leads", value: analytics.leads },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-semibold">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conversations per day (last 14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-28 items-end gap-1">
              {analytics.days.map((d) => (
                <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-primary/70"
                    style={{ height: `${(d.count / analytics.maxCount) * 100}%`, minHeight: d.count ? 4 : 0 }}
                    title={`${d.label}: ${d.count}`}
                  />
                  <span className="text-[9px] text-muted-foreground">{d.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent conversations</CardTitle>
              <CardDescription>Click one to read the full transcript.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y p-0">
              {logs.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">No conversations logged yet.</p>
              )}
              {logs.map((log) => (
                <button
                  key={log.id}
                  onClick={() => openTranscript(log)}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {log.first_question || "(no question captured)"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()} · {log.message_count} messages
                    </p>
                  </div>
                  {log.lead && <Badge variant="secondary" className="gap-1"><Hand className="h-3 w-3" aria-hidden="true" /> Lead</Badge>}
                  {log.flagged && <Badge variant="destructive" className="gap-1"><Flag className="h-3 w-3" aria-hidden="true" /> Flagged</Badge>}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Most common opening questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analytics.topOpenings.length === 0 && (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              )}
              {analytics.topOpenings.map(([q, count]) => (
                <div key={q} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <p className="truncate text-sm">{q}</p>
                  <Badge variant="secondary">{count}×</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Versions dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configuration versions</DialogTitle>
            <DialogDescription>Roll back to any previous published version.</DialogDescription>
          </DialogHeader>
          <div className="divide-y">
            {versions.map((v) => (
              <div key={v.id} className="flex items-center gap-3 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Version {v.version}
                    <Badge variant={v.status === "published" ? "default" : "secondary"} className="ml-2">{v.status}</Badge>
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleString()}</p>
                </div>
                {v.status !== "published" && (
                  <Button variant="outline" size="sm" onClick={() => rollback(v)}>
                    <RotateCcw className="mr-2 h-3.5 w-3.5" aria-hidden="true" /> Restore
                  </Button>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Transcript dialog */}
      <Dialog open={!!openLog} onOpenChange={(open) => !open && setOpenLog(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transcript</DialogTitle>
            <DialogDescription>
              {openLog && new Date(openLog.created_at).toLocaleString()} · {openLog?.message_count} messages
            </DialogDescription>
          </DialogHeader>
          {openLog && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleFlag(openLog)}>
                  <Flag className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                  {openLog.flagged ? "Unflag" : "Flag as bad answer"}
                </Button>
              </div>
              <div className="space-y-2">
                {logMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-lg p-3 text-sm ${m.role === "user" ? "bg-primary/10" : "bg-muted"}`}
                  >
                    <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">{m.role}</p>
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  </div>
                ))}
                {logMessages.length === 0 && (
                  <p className="text-sm text-muted-foreground">No messages stored for this conversation.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

export default OrckaAdmin;
