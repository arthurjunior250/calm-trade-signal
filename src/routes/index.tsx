import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDot,
  Lock,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { PAIRS, fetchAllTimeframes, type PairValue } from "@/lib/market-data";
import {
  LOCK_DURATION_MS,
  generateSignal,
  type GeneratedSignal,
  type TimeframeAnalysis,
} from "@/lib/signal-engine";
import {
  appendHistory,
  clearHistory,
  getActiveSignal,
  getHistory,
  setActiveSignal,
} from "@/lib/signal-storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Multi-Timeframe Locked Signals — Trading Bot" },
      {
        name: "description",
        content:
          "Generate a single locked BUY/SELL/HOLD signal from MN, W1, D1, H4, H1, M30, M15 and M1 candles. Decision is fixed for 10 minutes.",
      },
      { property: "og:title", content: "Multi-Timeframe Locked Signals" },
      {
        property: "og:description",
        content:
          "Combine 8 timeframes into one locked trading decision with entry, SL, TP — fixed for 10 minutes.",
      },
    ],
  }),
  component: SignalPage,
});

function formatPrice(n: number, pair: string) {
  if (!Number.isFinite(n)) return "—";
  if (pair.includes("JPY")) return n.toFixed(3);
  if (pair.startsWith("XAU")) return n.toFixed(2);
  return n.toFixed(5);
}

function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function useCountdown(target: number | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (!target) return null;
  const ms = Math.max(0, target - now);
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { ms, label: `${m}:${s.toString().padStart(2, "0")}` };
}

function SignalPage() {
  const [pair, setPair] = useState<PairValue>("EUR/USD");
  const [signal, setSignal] = useState<GeneratedSignal | null>(null);
  const [history, setHistory] = useState<GeneratedSignal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    setSignal(getActiveSignal(pair));
  }, [pair]);

  const countdown = useCountdown(signal?.expiresAt ?? null);

  useEffect(() => {
    if (signal && countdown && countdown.ms === 0) {
      setSignal(null);
    }
  }, [countdown, signal]);

  async function handleGenerate() {
    const existing = getActiveSignal(pair);
    if (existing) {
      setSignal(existing);
      toast.info("A locked signal is still active for this pair");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchAllTimeframes(pair);
      if (!data.H1?.length) {
        throw new Error("No H1 data returned. Try again in a moment.");
      }
      const sig = generateSignal(pair, data);
      setActiveSignal(sig);
      appendHistory(sig);
      setSignal(sig);
      setHistory(getHistory());
      toast.success(`${sig.decision} locked for 10 minutes`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate signal";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
    toast.success("History cleared");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors theme="dark" position="top-right" />
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-none">
                Multi-Timeframe Signals
              </h1>
              <p className="text-xs text-muted-foreground">
                MN · W1 · D1 · H4 · H1 · M30 · M15 · M1 — locked for 10 minutes
              </p>
            </div>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">
            Not financial advice
          </Badge>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <SignalCard
            signal={signal}
            pair={pair}
            countdown={countdown}
            loading={loading}
            onGenerate={handleGenerate}
          />
          {signal && <EdgeScoreCard signal={signal} />}
          {signal && <VoteTallyCard signal={signal} />}
          {signal && <TimeframesCard signal={signal} />}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pair">Pair</Label>
                <Select
                  value={pair}
                  onValueChange={(v) => setPair(v as PairValue)}
                >
                  <SelectTrigger id="pair">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAIRS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                Live candles from Yahoo Finance across 8 timeframes. No API key.
              </p>
            </CardContent>
          </Card>

          <HistoryCard history={history} onClear={handleClearHistory} />
        </aside>
      </main>
    </div>
  );
}

function SignalCard({
  signal,
  pair,
  countdown,
  loading,
  onGenerate,
}: {
  signal: GeneratedSignal | null;
  pair: string;
  countdown: { ms: number; label: string } | null;
  loading: boolean;
  onGenerate: () => void;
}) {
  const decisionColor =
    signal?.decision === "BUY"
      ? "text-primary"
      : signal?.decision === "SELL"
        ? "text-destructive"
        : "text-muted-foreground";
  const DecisionIcon =
    signal?.decision === "BUY"
      ? ArrowUpCircle
      : signal?.decision === "SELL"
        ? ArrowDownCircle
        : CircleDot;
  const lockProgress =
    signal && countdown
      ? Math.max(0, Math.min(100, (countdown.ms / LOCK_DURATION_MS) * 100))
      : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {pair} · 8-TF consensus
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Last closed candles on MN → M1
          </p>
        </div>
        <Button
          onClick={onGenerate}
          disabled={loading || (!!signal && (countdown?.ms ?? 0) > 0)}
          size="sm"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {signal ? "Locked" : loading ? "Analyzing…" : "Generate signal"}
        </Button>
      </CardHeader>
      <CardContent>
        {!signal ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <CircleDot className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No active signal. Generate one to lock a decision for 10 minutes.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                <DecisionIcon className={`h-12 w-12 ${decisionColor}`} />
                <div>
                  <div className={`text-4xl font-bold tracking-tight ${decisionColor}`}>
                    {signal.decision}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Edge Score {signal.confidence}/100 · {signal.confidenceLabel} confidence ·{" "}
                    {signal.edge.trendLabel}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Locked
                </div>
                <div className="mt-1 font-mono text-2xl tabular-nums">
                  {countdown?.label ?? "0:00"}
                </div>
              </div>
            </div>
            <Progress value={lockProgress} className="h-1" />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Entry" value={formatPrice(signal.entry, signal.pair)} />
              <Stat
                label="Stop Loss"
                value={formatPrice(signal.stopLoss, signal.pair)}
                tone="destructive"
              />
              <Stat
                label="Take Profit"
                value={formatPrice(signal.takeProfit, signal.pair)}
                tone="primary"
              />
              <Stat label="R:R" value={`1:${signal.riskReward.toFixed(2)}`} />
            </div>
            <Separator />
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>Generated: {formatTime(signal.generatedAt)}</span>
              <span>Expires: {formatTime(signal.expiresAt)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "primary" | "destructive";
}) {
  const color =
    tone === "primary"
      ? "text-primary"
      : tone === "destructive"
        ? "text-destructive"
        : "text-foreground";
  return (
    <div className="rounded-md bg-muted/50 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 font-mono text-lg tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

function TimeframesCard({ signal }: { signal: GeneratedSignal }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Timeframe breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b border-border/60">
                <th className="py-2 text-left font-medium">TF</th>
                <th className="py-2 text-left font-medium">Bias</th>
                <th className="py-2 text-right font-medium">RSI</th>
                <th className="py-2 text-right font-medium">MACD</th>
                <th className="py-2 text-right font-medium">EMA20/50</th>
                <th className="py-2 text-right font-medium">Weight</th>
                <th className="py-2 text-right font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {signal.timeframes.map((t) => {
                const biasColor =
                  t.bias === 1
                    ? "text-primary"
                    : t.bias === -1
                      ? "text-destructive"
                      : "text-muted-foreground";
                const ema =
                  t.ema20 != null && t.ema50 != null
                    ? t.ema20 > t.ema50
                      ? "↑"
                      : "↓"
                    : "—";
                return (
                  <tr key={t.tf} className="border-b border-border/30">
                    <td className="py-2 font-medium">{t.tf}</td>
                    <td className={`py-2 ${biasColor}`}>{t.note}</td>
                    <td className="py-2 text-right font-mono tabular-nums">
                      {t.rsi != null ? t.rsi.toFixed(1) : "—"}
                    </td>
                    <td
                      className={`py-2 text-right font-mono tabular-nums ${
                        t.macdHist == null
                          ? ""
                          : t.macdHist > 0
                            ? "text-primary"
                            : "text-destructive"
                      }`}
                    >
                      {t.macdHist != null ? t.macdHist.toExponential(1) : "—"}
                    </td>
                    <td className="py-2 text-right">{ema}</td>
                    <td className="py-2 text-right text-muted-foreground">
                      {t.weight}
                    </td>
                    <td
                      className={`py-2 text-right font-mono tabular-nums ${
                        t.score > 0
                          ? "text-primary"
                          : t.score < 0
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }`}
                    >
                      {t.score >= 0 ? "+" : ""}
                      {t.score.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function VoteTallyCard({ signal }: { signal: GeneratedSignal }) {
  const buyRows = signal.timeframes.filter((t) => t.bias === 1);
  const sellRows = signal.timeframes.filter((t) => t.bias === -1);
  const neutralRows = signal.timeframes.filter((t) => t.bias === 0);

  const buyScore = buyRows.reduce((a, t) => a + t.score, 0);
  const sellScore = Math.abs(sellRows.reduce((a, t) => a + t.score, 0));
  const buyWeight = buyRows.reduce((a, t) => a + t.weight, 0);
  const sellWeight = sellRows.reduce((a, t) => a + t.weight, 0);

  const winner: "BUY" | "SELL" | "TIE" =
    buyScore > sellScore ? "BUY" : sellScore > buyScore ? "SELL" : "TIE";
  const diff = Math.abs(buyScore - sellScore);
  const priority =
    winner === "TIE"
      ? "No clear edge — HOLD"
      : diff >= 25
        ? `${winner} has STRONG priority`
        : diff >= 10
          ? `${winner} has moderate priority`
          : `${winner} has slight edge`;

  const tfList = (rows: TimeframeAnalysis[]) =>
    rows.length ? rows.map((r) => r.tf).join(", ") : "—";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Buy vs Sell priority</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b border-border/60">
                <th className="py-2 text-left font-medium">Side</th>
                <th className="py-2 text-left font-medium">Timeframes</th>
                <th className="py-2 text-right font-medium">Votes</th>
                <th className="py-2 text-right font-medium">Weight</th>
                <th className="py-2 text-right font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30">
                <td className="py-2 font-semibold text-primary">BUY</td>
                <td className="py-2 text-muted-foreground">{tfList(buyRows)}</td>
                <td className="py-2 text-right font-mono tabular-nums">{buyRows.length}</td>
                <td className="py-2 text-right font-mono tabular-nums">{buyWeight}</td>
                <td className="py-2 text-right font-mono tabular-nums text-primary">
                  +{buyScore.toFixed(1)}
                </td>
              </tr>
              <tr className="border-b border-border/30">
                <td className="py-2 font-semibold text-destructive">SELL</td>
                <td className="py-2 text-muted-foreground">{tfList(sellRows)}</td>
                <td className="py-2 text-right font-mono tabular-nums">{sellRows.length}</td>
                <td className="py-2 text-right font-mono tabular-nums">{sellWeight}</td>
                <td className="py-2 text-right font-mono tabular-nums text-destructive">
                  -{sellScore.toFixed(1)}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-muted-foreground">NEUTRAL</td>
                <td className="py-2 text-muted-foreground">{tfList(neutralRows)}</td>
                <td className="py-2 text-right font-mono tabular-nums">{neutralRows.length}</td>
                <td className="py-2 text-right font-mono tabular-nums">
                  {neutralRows.reduce((a, t) => a + t.weight, 0)}
                </td>
                <td className="py-2 text-right font-mono tabular-nums text-muted-foreground">
                  0.0
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Priority verdict</div>
            <div
              className={`mt-1 text-sm font-semibold ${
                winner === "BUY"
                  ? "text-primary"
                  : winner === "SELL"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {priority}
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>Δ score</div>
            <div className="font-mono text-base text-foreground tabular-nums">
              {diff.toFixed(1)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HistoryCard({
  history,
  onClear,
}: {
  history: GeneratedSignal[];
  onClear: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Signal history</CardTitle>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No signals yet.</p>
        ) : (
          <ul className="space-y-2">
            {history.slice(0, 20).map((h) => {
              const color =
                h.decision === "BUY"
                  ? "text-primary"
                  : h.decision === "SELL"
                    ? "text-destructive"
                    : "text-muted-foreground";
              return (
                <li
                  key={`${h.pair}-${h.generatedAt}`}
                  className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm"
                >
                  <div>
                    <div className="font-medium">{h.pair}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(h.generatedAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${color}`}>{h.decision}</div>
                    <div className="text-xs text-muted-foreground">
                      {h.confidence}%
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function EdgeScoreCard({ signal }: { signal: GeneratedSignal }) {
  const { edge } = signal;
  const decisionColor =
    signal.decision === "BUY"
      ? "text-primary"
      : signal.decision === "SELL"
        ? "text-destructive"
        : "text-muted-foreground";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Edge Score breakdown</CardTitle>
        <p className="text-xs text-muted-foreground">
          Combined confidence from 5 weighted market factors — no single indicator decides.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b border-border/60">
                <th className="py-2 text-left font-medium">Factor</th>
                <th className="py-2 text-left font-medium">Bias</th>
                <th className="py-2 text-right font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {edge.components.map((c) => {
                const pct = (c.score / c.weight) * 100;
                const biasColor =
                  c.side === "bull"
                    ? "text-primary"
                    : c.side === "bear"
                      ? "text-destructive"
                      : "text-muted-foreground";
                const biasLabel =
                  c.side === "bull" ? "Bullish" : c.side === "bear" ? "Bearish" : "Neutral";
                return (
                  <tr key={c.name} className="border-b border-border/30 align-top">
                    <td className="py-2">
                      <div className="font-medium">{c.name}</div>
                      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
                        {c.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </td>
                    <td className={`py-2 ${biasColor}`}>{biasLabel}</td>
                    <td className="py-2 text-right font-mono tabular-nums">
                      <div>
                        {c.score}/{c.weight}
                      </div>
                      <div className="mt-1 h-1 w-16 overflow-hidden rounded bg-muted">
                        <div
                          className={`h-full ${
                            c.side === "bull"
                              ? "bg-primary"
                              : c.side === "bear"
                                ? "bg-destructive"
                                : "bg-muted-foreground/60"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td className="pt-3 font-semibold">Total Edge Score</td>
                <td className={`pt-3 font-semibold ${decisionColor}`}>{signal.decision}</td>
                <td className="pt-3 text-right font-mono text-base font-semibold tabular-nums">
                  {edge.total}/100
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="rounded-md bg-primary/10 p-2 text-center">
            <div className="text-muted-foreground">Bull points</div>
            <div className="mt-1 font-mono text-base font-semibold text-primary">{edge.bullPoints}</div>
          </div>
          <div className="rounded-md bg-destructive/10 p-2 text-center">
            <div className="text-muted-foreground">Bear points</div>
            <div className="mt-1 font-mono text-base font-semibold text-destructive">{edge.bearPoints}</div>
          </div>
          <div className="rounded-md bg-muted/50 p-2 text-center">
            <div className="text-muted-foreground">Confidence</div>
            <div className="mt-1 text-base font-semibold">{signal.confidenceLabel}</div>
          </div>
        </div>
        {signal.decision === "HOLD" && (
          <p className="rounded-md border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
            Edge score below 55 or no dominant side — staying out is the trade.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

