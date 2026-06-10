import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1, t as toast } from "../_libs/sonner.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { R as Root } from "../_libs/radix-ui__react-label.mjs";
import { S as Select$1, a as SelectValue$1, b as SelectTrigger$1, c as SelectIcon, d as SelectPortal, e as SelectContent$1, f as SelectViewport, g as SelectItem$1, h as SelectItemIndicator, i as SelectItemText, j as SelectScrollUpButton$1, k as SelectScrollDownButton$1, l as SelectLabel$1, m as SelectSeparator$1 } from "../_libs/radix-ui__react-select.mjs";
import { R as Root$1, I as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { R as Root$2 } from "../_libs/radix-ui__react-separator.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-BwKqoyDR.mjs";
import "../_libs/seroval.mjs";
import { T as TrendingUp, C as CircleArrowUp, a as CircleArrowDown, b as CircleDot, R as RefreshCw, L as Lock, c as ChevronDown, d as Check, e as ChevronUp } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/isbot.mjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Card = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = Root.displayName;
const Select = Select$1;
const SelectValue = SelectValue$1;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectTrigger$1,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectIcon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectTrigger$1.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollUpButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollDownButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectContent$1,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelectViewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectContent$1.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectLabel$1,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectLabel$1.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectItem$1,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectItem$1.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectSeparator$1,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectSeparator$1.displayName;
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Progress = reactExports.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root$1,
  {
    ref,
    className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = Root$1.displayName;
const Separator = reactExports.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root$2,
  {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  }
));
Separator.displayName = Root$2.displayName;
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const PAIRS = [{
  value: "EUR/USD",
  label: "EUR/USD",
  yahoo: "EURUSD=X"
}, {
  value: "GBP/USD",
  label: "GBP/USD",
  yahoo: "GBPUSD=X"
}, {
  value: "USD/JPY",
  label: "USD/JPY",
  yahoo: "USDJPY=X"
}, {
  value: "GBP/JPY",
  label: "GBP/JPY",
  yahoo: "GBPJPY=X"
}, {
  value: "XAU/USD",
  label: "XAU/USD (Gold)",
  yahoo: "GC=F"
}];
const fetchAllTimeframesFn = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  pair: stringType()
})).handler(createSsrRpc("bdc12cfac863d3cdd2a1989926c1047340bb6ca839acfa0b7000ead3a7fbf3b2"));
async function fetchAllTimeframes(pair) {
  return await fetchAllTimeframesFn({
    data: {
      pair
    }
  });
}
function ema(values, period) {
  if (values.length < period) return null;
  const k = 2 / (period + 1);
  let emaVal = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < values.length; i++) {
    emaVal = values[i] * k + emaVal * (1 - k);
  }
  return emaVal;
}
function emaSeries(values, period) {
  const out = [];
  if (values.length < period) return out;
  const k = 2 / (period + 1);
  let emaVal = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  out.push(emaVal);
  for (let i = period; i < values.length; i++) {
    emaVal = values[i] * k + emaVal * (1 - k);
    out.push(emaVal);
  }
  return out;
}
function rsi(values, period = 14) {
  if (values.length < period + 1) return null;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}
function macd(values, fast = 12, slow = 26, signalPeriod = 9) {
  if (values.length < slow + signalPeriod) return null;
  const fastSeries = emaSeries(values, fast);
  const slowSeries = emaSeries(values, slow);
  const offset = slow - fast;
  const macdLine = [];
  for (let i = 0; i < slowSeries.length; i++) {
    macdLine.push(fastSeries[i + offset] - slowSeries[i]);
  }
  const signalSeries = emaSeries(macdLine, signalPeriod);
  if (signalSeries.length < 2) return null;
  const last = signalSeries.length - 1;
  const macdNow = macdLine[macdLine.length - 1];
  const signalNow = signalSeries[last];
  const macdPrev = macdLine[macdLine.length - 2];
  const signalPrev = signalSeries[last - 1];
  return {
    macd: macdNow,
    signal: signalNow,
    histogram: macdNow - signalNow,
    prevHistogram: macdPrev - signalPrev
  };
}
function atr(candles, period = 14) {
  if (candles.length < period + 1) return null;
  const trs = [];
  for (let i = 1; i < candles.length; i++) {
    const c = candles[i];
    const p = candles[i - 1];
    const tr = Math.max(
      c.high - c.low,
      Math.abs(c.high - p.close),
      Math.abs(c.low - p.close)
    );
    trs.push(tr);
  }
  let atrVal = trs.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < trs.length; i++) {
    atrVal = (atrVal * (period - 1) + trs[i]) / period;
  }
  return atrVal;
}
const LOCK_MS = 10 * 60 * 1e3;
const LOCK_DURATION_MS = LOCK_MS;
const TF_WEIGHT = {
  MN: 5,
  W1: 8,
  D1: 12,
  H4: 15,
  H1: 20,
  M30: 15,
  M15: 15,
  M1: 10
};
function analyzeOneTf(tf, weight, candles) {
  const closes = candles.map((c) => c.close);
  const last = closes[closes.length - 1] ?? 0;
  const e20 = ema(closes, 20);
  const e50 = ema(closes, 50);
  const r = rsi(closes, 14);
  const m = macd(closes);
  if (!candles.length) {
    return {
      tf,
      weight,
      bias: 0,
      strength: 0,
      score: 0,
      close: 0,
      ema20: null,
      ema50: null,
      rsi: null,
      macdHist: null,
      note: "No data"
    };
  }
  const votes = [];
  if (e20 != null && e50 != null) {
    if (last > e20 && e20 > e50) votes.push(1);
    else if (last < e20 && e20 < e50) votes.push(-1);
    else votes.push(0);
  }
  if (r != null) {
    if (r > 55 && r < 75) votes.push(1);
    else if (r < 45 && r > 25) votes.push(-1);
    else votes.push(0);
  }
  if (m) {
    if (m.histogram > 0) votes.push(1);
    else if (m.histogram < 0) votes.push(-1);
    else votes.push(0);
  }
  let bias = 0;
  let strength = 0;
  if (votes.length) {
    const sum = votes.reduce((a, b) => a + b, 0);
    const avg = sum / votes.length;
    if (avg > 0.2) bias = 1;
    else if (avg < -0.2) bias = -1;
    strength = Math.abs(avg);
  }
  const score = weight * bias * strength;
  const note = bias === 1 ? "Bullish" : bias === -1 ? "Bearish" : "Neutral";
  return {
    tf,
    weight,
    bias,
    strength,
    score,
    close: last,
    ema20: e20,
    ema50: e50,
    rsi: r,
    macdHist: m?.histogram ?? null,
    note
  };
}
function generateSignal(pair, data) {
  const timeframes = Object.keys(TF_WEIGHT).map(
    (tf) => analyzeOneTf(tf, TF_WEIGHT[tf], data[tf] ?? [])
  );
  const totalScore = timeframes.reduce((a, t) => a + t.score, 0);
  let decision = "HOLD";
  if (totalScore >= 25) decision = "BUY";
  else if (totalScore <= -25) decision = "SELL";
  const confidence = Math.min(100, Math.round(Math.abs(totalScore)));
  const liveCandles = data.M1.length ? data.M1 : data.M15.length ? data.M15 : data.M30.length ? data.M30 : data.H1;
  const entry = liveCandles[liveCandles.length - 1].close;
  const h1Atr = atr(data.H1, 14) ?? entry * 1e-3;
  let stopLoss;
  let takeProfit;
  if (decision === "BUY") {
    stopLoss = entry - h1Atr * 1.5;
    takeProfit = entry + h1Atr * 3;
  } else if (decision === "SELL") {
    stopLoss = entry + h1Atr * 1.5;
    takeProfit = entry - h1Atr * 3;
  } else {
    stopLoss = entry - h1Atr * 1.5;
    takeProfit = entry + h1Atr * 1.5;
  }
  const riskReward = decision === "HOLD" ? 1 : Math.abs(takeProfit - entry) / Math.abs(entry - stopLoss);
  const generatedAt = Date.now();
  return {
    pair,
    decision,
    confidence,
    entry,
    stopLoss,
    takeProfit,
    riskReward,
    generatedAt,
    expiresAt: generatedAt + LOCK_MS,
    timeframes,
    totalScore
  };
}
const ACTIVE_KEY = "tab.active-signals.v1";
const HISTORY_KEY = "tab.signal-history.v1";
function readJSON(key, fallback) {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}
function getActiveSignal(pair) {
  const map = readJSON(ACTIVE_KEY, {});
  const sig = map[pair];
  if (!sig) return null;
  if (Date.now() >= sig.expiresAt) return null;
  return sig;
}
function setActiveSignal(sig) {
  const map = readJSON(ACTIVE_KEY, {});
  map[sig.pair] = sig;
  writeJSON(ACTIVE_KEY, map);
}
function appendHistory(sig) {
  const list = readJSON(HISTORY_KEY, []);
  if (list.length && list[0].pair === sig.pair && list[0].generatedAt === sig.generatedAt) {
    return;
  }
  list.unshift(sig);
  writeJSON(HISTORY_KEY, list.slice(0, 100));
}
function getHistory() {
  return readJSON(HISTORY_KEY, []);
}
function clearHistory() {
  writeJSON(HISTORY_KEY, []);
}
function formatPrice(n, pair) {
  if (!Number.isFinite(n)) return "—";
  if (pair.includes("JPY")) return n.toFixed(3);
  if (pair.startsWith("XAU")) return n.toFixed(2);
  return n.toFixed(5);
}
function formatTime(ms) {
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function useCountdown(target) {
  const [now, setNow] = reactExports.useState(() => Date.now());
  reactExports.useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(id);
  }, [target]);
  if (!target) return null;
  const ms = Math.max(0, target - now);
  const m = Math.floor(ms / 6e4);
  const s = Math.floor(ms % 6e4 / 1e3);
  return {
    ms,
    label: `${m}:${s.toString().padStart(2, "0")}`
  };
}
function SignalPage() {
  const [pair, setPair] = reactExports.useState("EUR/USD");
  const [signal, setSignal] = reactExports.useState(null);
  const [history, setHistory] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setHistory(getHistory());
  }, []);
  reactExports.useEffect(() => {
    setSignal(getActiveSignal(pair));
  }, [pair]);
  const countdown = useCountdown(signal?.expiresAt ?? null);
  reactExports.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, theme: "dark", position: "top-right" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold leading-none", children: "Multi-Timeframe Signals" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "MN · W1 · D1 · H4 · H1 · M30 · M15 · M1 — locked for 10 minutes" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "hidden sm:inline-flex", children: "Not financial advice" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_360px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SignalCard, { signal, pair, countdown, loading, onGenerate: handleGenerate }),
        signal && /* @__PURE__ */ jsxRuntimeExports.jsx(TimeframesCard, { signal })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Setup" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pair", children: "Pair" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: pair, onValueChange: (v) => setPair(v), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "pair", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: PAIRS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.value, children: p.label }, p.value)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Live candles from Yahoo Finance across 8 timeframes. No API key." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryCard, { history, onClear: handleClearHistory })
      ] })
    ] })
  ] });
}
function SignalCard({
  signal,
  pair,
  countdown,
  loading,
  onGenerate
}) {
  const decisionColor = signal?.decision === "BUY" ? "text-primary" : signal?.decision === "SELL" ? "text-destructive" : "text-muted-foreground";
  const DecisionIcon = signal?.decision === "BUY" ? CircleArrowUp : signal?.decision === "SELL" ? CircleArrowDown : CircleDot;
  const lockProgress = signal && countdown ? Math.max(0, Math.min(100, countdown.ms / LOCK_DURATION_MS * 100)) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: [
          pair,
          " · 8-TF consensus"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Last closed candles on MN → M1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onGenerate, disabled: loading || !!signal && (countdown?.ms ?? 0) > 0, size: "sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}` }),
        signal ? "Locked" : loading ? "Analyzing…" : "Generate signal"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !signal ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDot, { className: "mb-3 h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No active signal. Generate one to lock a decision for 10 minutes." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DecisionIcon, { className: `h-12 w-12 ${decisionColor}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-4xl font-bold tracking-tight ${decisionColor}`, children: signal.decision }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-sm text-muted-foreground", children: [
              "Confidence ",
              signal.confidence,
              "% · Score",
              " ",
              signal.totalScore >= 0 ? "+" : "",
              signal.totalScore.toFixed(1)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
            "Locked"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-mono text-2xl tabular-nums", children: countdown?.label ?? "0:00" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: lockProgress, className: "h-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Entry", value: formatPrice(signal.entry, signal.pair) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Stop Loss", value: formatPrice(signal.stopLoss, signal.pair), tone: "destructive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Take Profit", value: formatPrice(signal.takeProfit, signal.pair), tone: "primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "R:R", value: `1:${signal.riskReward.toFixed(2)}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Generated: ",
          formatTime(signal.generatedAt)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Expires: ",
          formatTime(signal.expiresAt)
        ] })
      ] })
    ] }) })
  ] });
}
function Stat({
  label,
  value,
  tone
}) {
  const color = tone === "primary" ? "text-primary" : tone === "destructive" ? "text-destructive" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-muted/50 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-1 font-mono text-lg tabular-nums ${color}`, children: value })
  ] });
}
function TimeframesCard({
  signal
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Timeframe breakdown" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 text-left font-medium", children: "TF" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 text-left font-medium", children: "Bias" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 text-right font-medium", children: "RSI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 text-right font-medium", children: "MACD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 text-right font-medium", children: "EMA20/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 text-right font-medium", children: "Weight" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 text-right font-medium", children: "Score" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: signal.timeframes.map((t) => {
        const biasColor = t.bias === 1 ? "text-primary" : t.bias === -1 ? "text-destructive" : "text-muted-foreground";
        const ema2 = t.ema20 != null && t.ema50 != null ? t.ema20 > t.ema50 ? "↑" : "↓" : "—";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 font-medium", children: t.tf }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `py-2 ${biasColor}`, children: t.note }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right font-mono tabular-nums", children: t.rsi != null ? t.rsi.toFixed(1) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `py-2 text-right font-mono tabular-nums ${t.macdHist == null ? "" : t.macdHist > 0 ? "text-primary" : "text-destructive"}`, children: t.macdHist != null ? t.macdHist.toExponential(1) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right", children: ema2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right text-muted-foreground", children: t.weight }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `py-2 text-right font-mono tabular-nums ${t.score > 0 ? "text-primary" : t.score < 0 ? "text-destructive" : "text-muted-foreground"}`, children: [
            t.score >= 0 ? "+" : "",
            t.score.toFixed(1)
          ] })
        ] }, t.tf);
      }) })
    ] }) }) })
  ] });
}
function HistoryCard({
  history,
  onClear
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Signal history" }),
      history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: onClear, children: "Clear" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No signals yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: history.slice(0, 20).map((h) => {
      const color = h.decision === "BUY" ? "text-primary" : h.decision === "SELL" ? "text-destructive" : "text-muted-foreground";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: h.pair }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(h.generatedAt).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-semibold ${color}`, children: h.decision }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            h.confidence,
            "%"
          ] })
        ] })
      ] }, `${h.pair}-${h.generatedAt}`);
    }) }) })
  ] });
}
export {
  SignalPage as component
};
