import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
import { PAIRS, fetchH1Candles, type PairValue } from "@/lib/market-data";
import {
  LOCK_DURATION_MS,
  generateSignal,
  type GeneratedSignal,
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
      { title: "Locked H1 Signals — Technical Analysis Bot" },
      {
        name: "description",
        content:
          "Generate a single locked BUY/SELL/HOLD trading signal per pair based on the last closed H1 candle. Signal stays fixed for 30 minutes.",
      },
      { property: "og:title", content: "Locked H1 Signals — Technical Analysis Bot" },
      {
        property: "og:description",
        content:
          "Lock a trading decision to the last closed hourly candle for 30 minutes with entry, SL, TP and full reasoning.",
      },
    ],
  }),
  component: SignalPage,
});

function formatPrice(n: number, pair: string) {
  if (pair.includes("JPY")) return n.toFixed(3);
  if (pair.startsWith("XAU")) return n.toFixed(2);
  return n.toFixed(5);
}

function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
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

  // Load locked signal whenever pair changes
  useEffect(() => {
    setSignal(getActiveSignal(pair));
  }, [pair]);

  const countdown = useCountdown(signal?.expiresAt ?? null);

  // When countdown hits zero, drop the locked signal
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
      const candles = await fetchH1Candles(pair);
      if (candles.length < 210) {
        throw new Error(
          `Not enough closed candles (got ${candles.length}, need 210+).`,
        );
      }
      const sig = generateSignal(pair, candles);
      setActiveSignal(sig);
      appendHistory(sig);
      setSignal(sig);
      setHistory(getHistory());
      toast.success(`${sig.decision} locked for 30 minutes`);
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
              <h1 className="text-lg font-semibold leading-none">Locked H1 Signals</h1>
              <p className="text-xs text-muted-foreground">
                One decision per pair, fixed for 30 minutes
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
          {signal && <ReasoningCard signal={signal} />}
          {signal && <IndicatorsCard signal={signal} />}
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
                Live H1 candles from Yahoo Finance. No API key required.
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
            {pair} · H1
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Based on the last closed hourly candle
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
              No active signal. Generate one to lock a decision for 30 minutes.
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
                    Confidence {signal.confidence}%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Locked until {formatTime(signal.expiresAt)}
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
              <span>Signal generated: {formatTime(signal.generatedAt)}</span>
              <span>
                Source candle: {formatTime(signal.basedOnCandleTime * 1000)} –{" "}
                {formatTime(signal.basedOnCandleTime * 1000 + 3_600_000)}
              </span>
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

function ReasoningCard({ signal }: { signal: GeneratedSignal }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Reasoning</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {signal.reasoning.map((r, i) => {
            const tone =
              r.weight > 0
                ? "text-primary"
                : r.weight < 0
                  ? "text-destructive"
                  : "text-muted-foreground";
            return (
              <li
                key={i}
                className="flex items-start justify-between gap-4 rounded-md border border-border/60 px-3 py-2"
              >
                <div>
                  <div className="text-sm font-medium">{r.label}</div>
                  <div className="text-xs text-muted-foreground">{r.detail}</div>
                </div>
                <span className={`font-mono text-sm ${tone}`}>
                  {r.weight > 0 ? "+" : ""}
                  {r.weight}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

function IndicatorsCard({ signal }: { signal: GeneratedSignal }) {
  const ind = signal.indicators;
  const rows = useMemo(
    () => [
      ["EMA 20", ind.ema20 != null ? formatPrice(ind.ema20, signal.pair) : "—"],
      ["EMA 50", ind.ema50 != null ? formatPrice(ind.ema50, signal.pair) : "—"],
      ["EMA 200", ind.ema200 != null ? formatPrice(ind.ema200, signal.pair) : "—"],
      ["RSI (14)", ind.rsi != null ? ind.rsi.toFixed(2) : "—"],
      [
        "MACD",
        ind.macd
          ? `${ind.macd.macd.toFixed(5)} / sig ${ind.macd.signal.toFixed(5)}`
          : "—",
      ],
      ["ATR (14)", ind.atr != null ? ind.atr.toFixed(5) : "—"],
      [
        "Support",
        ind.support != null ? formatPrice(ind.support, signal.pair) : "—",
      ],
      [
        "Resistance",
        ind.resistance != null ? formatPrice(ind.resistance, signal.pair) : "—",
      ],
    ],
    [ind, signal.pair],
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-border/40 py-1">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-mono tabular-nums">{v}</span>
            </div>
          ))}
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
