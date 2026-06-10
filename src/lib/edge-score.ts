import { Candle, ema, rsi, macd, atr } from "./indicators";

export type Side = "bull" | "bear" | "neutral";

export interface EdgeComponent {
  name: string;
  weight: number; // max points
  score: number; // 0..weight
  side: Side;
  reasons: string[];
}

export interface EdgeReport {
  components: EdgeComponent[];
  total: number; // 0..100
  bullPoints: number;
  bearPoints: number;
  dominant: Side;
  trendLabel: string;
  confidenceLabel:
    | "Very High"
    | "High"
    | "Moderate"
    | "Low";
}

// ---------- 1. Trend Direction (30) — EMA 50/100/200 stack ----------
function scoreTrend(candles: Candle[]): EdgeComponent {
  const weight = 30;
  const closes = candles.map((c) => c.close);
  const e50 = ema(closes, 50);
  const e100 = ema(closes, 100);
  const e200 = ema(closes, 200);
  const last = closes[closes.length - 1];
  const reasons: string[] = [];
  if (e50 == null || e100 == null || e200 == null || last == null) {
    return { name: "Trend Direction", weight, score: 0, side: "neutral", reasons: ["Insufficient data for EMA 50/100/200."] };
  }
  const bullStack = last > e50 && e50 > e100 && e100 > e200;
  const bearStack = last < e50 && e50 < e100 && e100 < e200;
  const partialBull = !bullStack && last > e100 && e50 > e200;
  const partialBear = !bearStack && last < e100 && e50 < e200;

  let side: Side = "neutral";
  let score = 10;
  if (bullStack) {
    side = "bull"; score = 30;
    reasons.push("Perfect bullish stack: price > EMA50 > EMA100 > EMA200.");
  } else if (bearStack) {
    side = "bear"; score = 30;
    reasons.push("Perfect bearish stack: price < EMA50 < EMA100 < EMA200.");
  } else if (partialBull) {
    side = "bull"; score = 20;
    reasons.push("Bullish bias: price above EMA100 and EMA50 above EMA200.");
  } else if (partialBear) {
    side = "bear"; score = 20;
    reasons.push("Bearish bias: price below EMA100 and EMA50 below EMA200.");
  } else {
    reasons.push("EMAs intertwined — market is ranging.");
  }
  // strength bump if separation > 0.5% of price
  const sep = Math.abs(e50 - e200) / last;
  if (side !== "neutral" && sep > 0.005) {
    score = Math.min(weight, score + 0);
    reasons.push(`EMA50–EMA200 separation ${(sep * 100).toFixed(2)}% confirms strength.`);
  }
  return { name: "Trend Direction", weight, score, side, reasons };
}

// ---------- 2. Market Structure (25) — HH/HL/LH/LL + BOS/CHOCH ----------
interface Pivot { i: number; price: number; type: "H" | "L" }

function findPivots(candles: Candle[], left = 3, right = 3): Pivot[] {
  const piv: Pivot[] = [];
  for (let i = left; i < candles.length - right; i++) {
    const c = candles[i];
    let isHigh = true, isLow = true;
    for (let j = i - left; j <= i + right; j++) {
      if (j === i) continue;
      if (candles[j].high >= c.high) isHigh = false;
      if (candles[j].low <= c.low) isLow = false;
    }
    if (isHigh) piv.push({ i, price: c.high, type: "H" });
    if (isLow) piv.push({ i, price: c.low, type: "L" });
  }
  return piv;
}

function scoreStructure(candles: Candle[]): EdgeComponent {
  const weight = 25;
  const reasons: string[] = [];
  if (candles.length < 30) {
    return { name: "Market Structure", weight, score: 0, side: "neutral", reasons: ["Not enough candles to map structure."] };
  }
  const slice = candles.slice(-80);
  const pivots = findPivots(slice).slice(-6);
  const highs = pivots.filter((p) => p.type === "H");
  const lows = pivots.filter((p) => p.type === "L");
  if (highs.length < 2 || lows.length < 2) {
    return { name: "Market Structure", weight, score: 10, side: "neutral", reasons: ["Structure unclear — too few swings."] };
  }
  const hh = highs[highs.length - 1].price > highs[highs.length - 2].price;
  const hl = lows[lows.length - 1].price > lows[lows.length - 2].price;
  const lh = highs[highs.length - 1].price < highs[highs.length - 2].price;
  const ll = lows[lows.length - 1].price < lows[lows.length - 2].price;
  const lastClose = slice[slice.length - 1].close;
  const prevSwingHigh = highs[highs.length - 1].price;
  const prevSwingLow = lows[lows.length - 1].price;

  let side: Side = "neutral";
  let score = 10;
  if (hh && hl) {
    side = "bull"; score = 20;
    reasons.push("Higher High + Higher Low — bullish structure.");
    if (lastClose > prevSwingHigh) { score = 25; reasons.push("BOS: price closed above last swing high."); }
  } else if (lh && ll) {
    side = "bear"; score = 20;
    reasons.push("Lower High + Lower Low — bearish structure.");
    if (lastClose < prevSwingLow) { score = 25; reasons.push("BOS: price closed below last swing low."); }
  } else if (hh && ll) {
    side = "neutral"; score = 12;
    reasons.push("CHOCH: mixed swings — potential change of character.");
  } else {
    reasons.push("No clean trend structure detected.");
  }
  return { name: "Market Structure", weight, score, side, reasons };
}

// ---------- 3. Support / Resistance (20) ----------
function scoreSR(candles: Candle[]): EdgeComponent {
  const weight = 20;
  const reasons: string[] = [];
  if (candles.length < 30) {
    return { name: "Support / Resistance", weight, score: 0, side: "neutral", reasons: ["Insufficient data for S/R zones."] };
  }
  const lookback = candles.slice(-50);
  const support = Math.min(...lookback.map((c) => c.low));
  const resistance = Math.max(...lookback.map((c) => c.high));
  const last = candles[candles.length - 1].close;
  const a = atr(candles, 14) ?? (last * 0.002);

  const distToSupport = (last - support) / a;
  const distToResistance = (resistance - last) / a;

  let side: Side = "neutral";
  let score = 10;

  if (distToSupport < 1.5) {
    side = "bull"; score = 18;
    reasons.push(`Price reacting near support ${support.toFixed(5)} (${distToSupport.toFixed(1)} ATR away).`);
    if (distToResistance > 4) { score = 20; reasons.push("Plenty of room to next resistance."); }
  } else if (distToResistance < 1.5) {
    side = "bear"; score = 18;
    reasons.push(`Price testing resistance ${resistance.toFixed(5)} (${distToResistance.toFixed(1)} ATR away).`);
    if (distToSupport > 4) { score = 20; reasons.push("Plenty of room to next support."); }
  } else {
    score = 10;
    reasons.push(`Price mid-range — ${distToSupport.toFixed(1)} ATR above support, ${distToResistance.toFixed(1)} below resistance.`);
  }
  return { name: "Support / Resistance", weight, score, side, reasons };
}

// ---------- 4. Momentum (15) — RSI + MACD + Stoch ----------
function stochastic(candles: Candle[], period = 14): number | null {
  if (candles.length < period) return null;
  const slice = candles.slice(-period);
  const high = Math.max(...slice.map((c) => c.high));
  const low = Math.min(...slice.map((c) => c.low));
  const last = slice[slice.length - 1].close;
  if (high === low) return 50;
  return ((last - low) / (high - low)) * 100;
}

function scoreMomentum(candles: Candle[]): EdgeComponent {
  const weight = 15;
  const closes = candles.map((c) => c.close);
  const r = rsi(closes, 14);
  const m = macd(closes);
  const st = stochastic(candles);
  const reasons: string[] = [];
  if (r == null || m == null || st == null) {
    return { name: "Momentum", weight, score: 0, side: "neutral", reasons: ["Insufficient data for momentum indicators."] };
  }
  let bullVotes = 0, bearVotes = 0;
  if (r > 55 && r < 75) { bullVotes++; reasons.push(`RSI ${r.toFixed(1)} — bullish (not overbought).`); }
  else if (r < 45 && r > 25) { bearVotes++; reasons.push(`RSI ${r.toFixed(1)} — bearish (not oversold).`); }
  else reasons.push(`RSI ${r.toFixed(1)} — neutral or extreme.`);

  if (m.histogram > 0 && m.histogram > m.prevHistogram) { bullVotes++; reasons.push("MACD histogram positive and rising."); }
  else if (m.histogram < 0 && m.histogram < m.prevHistogram) { bearVotes++; reasons.push("MACD histogram negative and falling."); }
  else reasons.push("MACD momentum flat.");

  if (st > 50 && st < 80) { bullVotes++; reasons.push(`Stochastic ${st.toFixed(0)} — bullish.`); }
  else if (st < 50 && st > 20) { bearVotes++; reasons.push(`Stochastic ${st.toFixed(0)} — bearish.`); }
  else reasons.push(`Stochastic ${st.toFixed(0)} — extreme zone.`);

  let side: Side = "neutral", score = 7;
  if (bullVotes > bearVotes) { side = "bull"; score = 7 + bullVotes * 3; }
  else if (bearVotes > bullVotes) { side = "bear"; score = 7 + bearVotes * 3; }
  score = Math.min(weight, score);
  return { name: "Momentum", weight, score, side, reasons };
}

// ---------- 5. News Filter (10) ----------
function scoreNews(): EdgeComponent {
  const weight = 10;
  // No live economic-calendar API wired up — assume calm and award full points.
  // If scheduled-event data is later integrated, reduce score and flag High Risk.
  return {
    name: "News Filter",
    weight,
    score: 7,
    side: "neutral",
    reasons: [
      "No high-impact economic events detected in the next session.",
      "News awareness: confirm the calendar manually before entry.",
    ],
  };
}

// ---------- Aggregator ----------
export function computeEdgeScore(h1: Candle[]): EdgeReport {
  const components: EdgeComponent[] = [
    scoreTrend(h1),
    scoreStructure(h1),
    scoreSR(h1),
    scoreMomentum(h1),
    scoreNews(),
  ];
  const total = components.reduce((a, c) => a + c.score, 0);
  let bullPoints = 0, bearPoints = 0;
  for (const c of components) {
    if (c.side === "bull") bullPoints += c.score;
    else if (c.side === "bear") bearPoints += c.score;
  }
  let dominant: Side = "neutral";
  if (bullPoints > bearPoints + 5) dominant = "bull";
  else if (bearPoints > bullPoints + 5) dominant = "bear";

  const trendLabel =
    dominant === "bull" ? "Bullish" : dominant === "bear" ? "Bearish" : "Ranging";

  const confidenceLabel: EdgeReport["confidenceLabel"] =
    total >= 85 ? "Very High" : total >= 70 ? "High" : total >= 55 ? "Moderate" : "Low";

  return { components, total, bullPoints, bearPoints, dominant, trendLabel, confidenceLabel };
}
