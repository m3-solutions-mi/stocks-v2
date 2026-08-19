# Uptick — Code Summary

A single-file HTML app (`uptick-demo.html`) — everything below lives in one `<script>` tag, in the order it's described here.

---

## Latest insight — V074 — August 19, 2026

Since V061, the project's center of gravity shifted entirely: from polishing an already-working watchlist app to designing, building, and — as of today — **validating with real money** a full automated-trading feature. The throughline across all of it: **design before code, verify with numbers not assertions, and trust a real screenshot over an abstract argument whenever the two disagree.**

**The design phase came first, deliberately, and paid off directly.** Rather than a spec, the feature emerged through incremental scaffolding (`getHMM()` as inert infrastructure, then the bolt toggle as a pure setting with no execution behind it yet, then finally "let's go through the logic together") — each piece giving the next something concrete to react to. This wasn't padding: it's what let the user catch, unprompted, that the buy window was silently also gating sells (a real bug that would have left a losing position unwatched exactly when it mattered), and that "sell on a red bar" needed to mean a *crossover* — a fresh transition, preceded by a *non-red* bar — not a static color, which is what makes the rule fire once per direction change instead of repeatedly through a whole losing stretch. A written design doc (`uptick-automated-trading-logic.md`) captured every resolved decision before any of it became code, specifically so it could be reviewed and revised before the stakes went up.

**Every gate is fail-closed, verified exhaustively, not just written.** `evaluateAutomatedTrading()` (§12) is wrapped in nested try/catches; any error — a failed positions fetch, a malformed series — aborts that pass with no action, never a fallback assumption. The $100 invest cap is enforced at four independent points (HTML `max`, Settings save-time clamp, restore-from-storage clamp, and the buy execution's own independent clamp) referencing one shared constant, proven numerically that even a config value that somehow bypassed the earlier layers still can't slip through the last one.

**Two real bugs were caught before they ever shipped, both by careful re-reading rather than by luck:**
- `executeSell()` calls a blocking `confirm()` — reusing it from automated logic would have frozen an unattended page indefinitely, since `confirm()` blocks the JS event loop and nothing is there to click it. Caught by re-reading the function before wiring it in; automated logic calls `TradingAPI.buy()/sell()` directly instead, which were already prompt-free.
- The end-of-day sell trigger originally used `else if` against the normal eval-second trigger. Since both defaulted to the same second (59), the `else if` meant the EOD-specific "sell unconditionally" behavior would have silently never fired in the default configuration — the normal branch would always win the tie, and the position would only sell if a crossover or max-loss trigger *also* happened to be true at that exact moment. Fixed to two independent `if`s before it ever reached the user.

**The three-color deadband chart visualization (§5) turned into a genuine research tool, not just a bug-fix.** It was built to answer "why didn't this fire" after a real discrepancy between the chart's old two-color coding and what the logic actually evaluated — but once built, comparing it across several real symbols side-by-side surfaced that a single flat deadband means something very different depending on a symbol's natural volatility (QQQ reading as almost entirely neutral under the same threshold that gave SOXL a healthy, balanced mix). That's now open, explicitly-deferred research, not a settled number — the visualization did its job by making the question askable in the first place.

**Day caps (§12) went through a real design reversal, not a straight build.** The first version ("stops buying, does not force-sell") was reasoned from the bolt-toggle's existing "stop ≠ sell" principle — but that analogy didn't actually fit. The bolt toggle is a narrow, per-symbol decision; the day cap is modeled on genuinely quitting for the day, which means being fully out, not paused-with-exposure. Revised to liquidate and lock out, with the lockout deliberately sticky through the session (verified numerically against the exact scenario that motivates it: a sell settling below the triggering value, thanks to spread, must not read as "back under the cap, resume").

**Visual fixes repeatedly demonstrated the same lesson from both directions.** The bolt toggle's icon color went through several real iterations — WCAG contrast math favored a dark icon, but real screenshots showed it disappearing into the fill; white was tried next based on that same visual evidence, and held up even once the math for the *other* fill color was checked too. Separately, an "armed" state built with `opacity:.45` was diagnosed as a genuine CSS problem for two full rounds before the real explanation surfaced: it was working exactly as designed, correctly dimmed because the screenshot was taken outside the configured trading window — not a rendering bug at all. Both threads ended the same way: trust what's actually on screen, and verify the actual state before assuming the code is wrong.

**Today, live: the design was confirmed against real trades, not just against tests.** The bot bought (capped at $100) and later sold a position on its own, matching the crossover logic exactly as designed weeks of conversation earlier. A separate, related scenario also got exercised for real: a bot-bought position that the user then manually added to (bringing it from $100 to $1000) was still correctly monitored by the bot's sell logic — confirmed directly from the code that the bot reads one shared, blended position from the broker, with no concept of "whose share is whose," and that a sell would close the entire position, manual addition included, not just its own original portion. End-of-day sell (15:55) was not exercised today — too early in the session for that specific trigger to have come up — and remains unverified live, though numerically confirmed at build time.

Two safety gaps were found and closed *after* the core feature already existed, each surfaced by the user thinking through a scenario the original design hadn't considered: importing settings onto a second device would have silently carried over an armed master switch and enabled symbols from the exporting device, since export/import predates automated trading and was never built with it in mind — fixed by forcing those specific fields off on import while preserving the numeric configuration. And the blue five-minute cue and the bot's own execution both used to span a broader 4am–8pm `isLive` window rather than actual regular trading hours — narrowed with a new, additional, shared gate rather than touching `isLive` itself, since that broader definition is still genuinely needed elsewhere (chart refresh, historical-date detection).

---

## 1. Config & State

**`CONFIG`** — the one object holding every setting: `dataMode` ("sample" | "api"), symbol/account API URLs and credentials, `smaPeriod`, `lossAlertPct` (default -0.5, drives three separate hue treatments from one value), two independent refresh rates (`chartRefreshSeconds`, `accountRefreshSeconds`), and `autoTrading` (full detail in §12).

**Top-level state variables**:
- `TICKERS` / `selectedTickerIds` — the watchlist roster and which of them are checked
- `tickerPresets` — named snapshots of `selectedTickerIds` ("symbol groups")
- `currentTf` / `currentView` / `displayWindow` — Timeframe, active view (`trend` | `compare` | `table` | `research` | `positions`), and the "Today" hour-window slice
- `selectedDate` — a picked historical date, or `null` for live ("pretend this day is today")
- `researchSymbol` — the Research view's currently-applied search
- `heldPositions` — `Map<symbol, {dollar, pct, costBasis, currentPrice}>` from the live positions array (fixed, non-moving stub for 3 tickers in Sample mode)
- `autoTradeEnabledIds` — which tickers are bolt-enabled for automated trading, same `Set` pattern as `selectedTickerIds` (§12)
- `controlsExpanded` / `statsRowExpanded` — the two collapsible accordions, now persisted (a real preference reversal after real iPad use — always-expanded-on-load turned out to be more friction than the original "don't confuse a later session" concern was worth)
- `seriesCache` / `viewSignatures` / `viewMeta` — caching layers, covered in §7

**Persistence** (`loadSettings()` / `saveSettings()`): everything above except `selectedDate` and `researchSymbol` gets written to one `localStorage` key (`uptick-settings-v1`) as a single JSON blob. Import deliberately overrides parts of this blob before it's ever written — see §12's safety notes.

---

## 2. Date & Session Logic

**`effectiveToday()`** — the single choke point every date function routes through: returns `selectedDate` if picked, otherwise the real current moment.

**`mostRecentTradingDay()` / `previousTradingDay()` / `tradingDayNDaysAgo(days)`** — weekday-aware date walking for the daily-bar windows (10D/30D/90D/180D), anchored through `effectiveToday()`.

**`getSessionWindow()`** — simulates a real trading session (4:00 AM–8:00 PM), holding at the last completed session outside that window. Returns `{sessionStart, sessionEnd, sessionNow, isLive}`. When `selectedDate` is set, always returns `isLive: false` — one flag disabling Buy/Sell, pausing chart auto-refresh, and hiding the held-position dot, all from a single source.

**`getSeriesWindow(tf)`** — computes fetch boundaries: `wideStart` (extra lookback so SMA has real history) and `displayStart` (the actual shown boundary).

**`trimToDisplayWindow()`** — trims `times`/`close`/`sma` together once SMA is computed on the wider set.

**`applyDisplayWindow(data, windowKey, tf)`** — "Full Day" / "9:00–4:30" / "Last 6H." Anchors to the data's own last timestamp, not `getSessionWindow()` — self-contained, and future-proofed for eventual historical-day browsing.

---

## 3. Sample Data Generator

**`generateSample(symbol, tf)`** — synthetic data, seeded (`mulberry32` + `hashStr`) so the same symbol+timeframe always generates the same shape, with a small live-tick jitter on the last bar while `isLive`.

**`sma(values, period)`** — before the window is full, each point defaults to its own close, so `close − SMA` is exactly 0 during warm-up.

---

## 4. DataSource, TradingAPI & Account

**`DataSource.loadSeries(symbol, tf)`** — branches on `CONFIG.dataMode`, then on `CONFIG.api.activeSymbolSource` in Live mode:
- **Source A** (your own proxy) — path-based URL, no auth.
- **Source B** (Alpaca directly) — a genuinely different request shape: query-string params (`symbols`, `timeframe`, `start`, `end`, `feed=iex`, `limit=5000`, `sort=asc`), account credentials reused as auth headers (not a separate symbol-data credential), base URL defaults to Alpaca's real endpoint but is overridable via the same Settings field for a future version bump.

Both paths coerce `close` to `Number()` and normalize the last intraday bar's timestamp to a clean 5-minute boundary. Cached in `seriesCache`, keyed on `symbol|tf|selectedDate`.

**`DataSource.loadAccountInfo()`** — Live mode fetches `/v2/account` + `/v2/positions` in parallel, populates `heldPositions`, returns `combineAccountAndPositions()`'s dollar-weighted aggregate.

**`TradingAPI`** — `buy()`, `sell()`, `liquidateAll()`.

**`executeSell(symbol, btn)`** — shared by Compare's sell buttons (id-based) and the Positions table's sell buttons (symbol-based directly, since a held position isn't guaranteed to be in the configured watchlist). Awaits `renderAccountRow()` internally so `heldPositions` is guaranteed fresh by the time it returns.

---

## 5. Chart Building

**`buildComboOptions(...)`** — builds every chart's ApexCharts config. 3 series (delta bars, Close, SMA), 2 y-axes. Delta bar padding is minimal (`maxAbsDelta * 1.04`) so the tallest bar nearly fills the available height. Bar coloring is three ranges, not two — green/neutral/red, split at `±CONFIG.autoTrading.deadbandPct` — matching exactly what the automated-trading logic (§12) evaluates, on every chart using this shared function (Trend, Compare, Research alike), not just where the bolt toggle lives. Originally a hard `delta >= 0` split with no neutral zone; changed after a real, confirmed gap between what the chart showed and what the logic actually saw.

**`marketSessionAnnotations()`** — dashed pink lines at Open (9:30)/Close (4:00).

**`hourlyAnnotations()`** — solid, light-grey, unlabeled lines at 10am–3pm specifically (deliberately excluding 9/16, already marked by Open/Close). A template for a possible future third annotation tier at specific, non-hourly times.

---

## 6. Views

Five views, one shared title/stat-row area:

- **`renderTrend()`** — Combined. Averages each selected ticker's own % change and SMA into one composite line.
- **`renderCompare()`** — one tile per ticker: chart, symbol color, held-position dot + $/% gain (live-only), Buy/Sell, and the automated-trading bolt toggle (§12) — three solid, fully-opaque states (off/armed/active), no `opacity` transparency anywhere.
- **`renderTable()`** — start/end/delta for the current window.
- **`renderResearch()`** — one-off symbol lookup, separate from the watchlist.
- **`renderPositions()`** — actual open positions, independent of ticker selection/timeframe/window. Symbol, $ Change, % Change, Cost Basis, Sell — reordered and Current Price dropped from display per explicit request ("not useful, just focused on making money"), though the field stays in the underlying data. A blue bolt icon prefixes the Symbol cell when that position's ticker is currently bolt-enabled — a read-only indicator, no click handler, reusing `autoTradeEnabledIds` directly rather than any new state; correctly resolves to false for a held symbol outside the watchlist entirely. Loss-alert hue applies per-row and on TOTAL independently — a single bad position doesn't get masked by an otherwise-fine total, and vice versa. Bypasses the view-signature cache entirely (cheap to rebuild; depends on data that updates on its own refresh cadence, not anything the cache key tracks).

**`render()`** dispatches on `currentView` via `currentSignature()`, and mutes whichever controls don't apply: ticker chips + symbol groups on Research and Positions; timeframe bar + window bar on Positions only.

---

## 7. Caching Layers (two, deliberately separate)

- **`seriesCache`** — raw fetched/generated data, keyed on `symbol|tf|date`.
- **`viewSignatures` / `viewMeta`** — per-view "have my inputs changed" tracking.

Two different real bugs came from each of these independently, at different points in the project: `seriesCache` missing the date component let a picked historical date silently return stale live data; `viewSignatures` not including `selectedDate` meant the view didn't know to re-render at all. Fixing one never implied the other was already correct.

---

## 8. Symbol Groups, Watchlist Management & the Historical Date Picker

**`renderTickerPresetRow()`** — a preset is a named snapshot of `selectedTickerIds`, never a separate ticker list. Saving under an existing name updates it *in place* now (fixed today — was previously removing-then-appending, silently moving the group to the end of the row). Muted whenever Research or Positions is active.

**`renderTickerManageList()`** — add/remove/reorder the watchlist roster via a staged `draftTickers` array. Reordering is up/down arrows, not drag-and-drop.

**The historical date picker** (`selectedDate`) — calendar icon on the Today button, its own click zone. Picking a date applies to whatever timeframe is already active. Picking today's actual date collapses back to `null` rather than staying a technically-non-null "historical" state. A 60-minute click-based inactivity timer reverts to live if a historical date sits unattended.

---

## 9. Auto-Refresh

Two independent wall-clock-aligned timers (`second % rate === 0`, checked on a plain 1-second tick):

- **Chart refresh** — gated on `getSessionWindow().isLive`.
- **Account refresh** — *not* gated on `isLive`. Runs 24/7.
- **Automated trading evaluation** (§12) — a third, separate condition on the same 1-second tick, requiring `isLive` *and* the same regular-hours window the blue cue below now shares. A fourth, independent `if` (deliberately not `else if` — see §12) handles the 15:55 end-of-day trigger.

A separate 200ms interval (`updateRefreshBar`) animates the countdown bar, and also drives the five-minute checkpoint highlight on the Today card (`.five-min-active` — steady, not pulsing, deliberately, so the cue meant to reduce reactive decisions doesn't become a source of it itself). This cue now requires regular trading hours specifically (930-1559), not just `isLive`'s broader 4am-8pm span — narrowed on request, since it was being read as "the bot could be active right now," which stopped being accurate once the bot's own execution got a separate, additional hours gate. `isLive` itself is untouched; only the cue's own display condition and the evaluator's execution gate were narrowed, each independently, sharing one set of constants rather than two that could drift apart.

---

## 10. Formatting & Sign Handling

**`round2(v)`** (`Math.round(v * 100) / 100`) — every display-facing rounded number in the app routes through this first, rather than trusting `toFixed()`'s own rounding, which can disagree with "round half up" on exact half-cent boundaries.

**`signOf(v)` / `signColor(v)` / `signPrefix(v)` / `signClass(v)` / `upDownNeutral(v)`** — determine up/down/neutral coloring based on the *rounded* value, not the raw one. Added today after finding a raw value like `-0.001` would display as `"0.00"` while still coloring red, since the color decision used the un-rounded number. All 16 sites in the app that made this kind of sign-based decision — stat cards, Compare tile color/gain, Table view, Research stats, Positions rows/TOTAL — now route through these instead of each doing its own `>= 0` check. `upDownNeutral()` specifically preserves `null` ("no data yet," e.g. CHANGE before a second update) as genuinely distinct from `"neutral"` (rounds to exactly zero) — collapsing those two would have been a regression, not a fix.

---

## 11. Misc

**`updatePageTitle(todayPL)`** — sets the browser tab title to `Uptick | ±$N | YYYY-MM-DD_HHMM`, piggybacked on the account refresh cadence. Exists so the browser's own Print/Save dialog — which defaults to suggesting the page title as the filename — becomes a free "auto-name my printed daily record" feature, mirroring a pattern from the user's other apps. Uses local date components (`getFullYear()`/`getMonth()`/`getDate()`) consistently with the already-local time components, after an initial version mixed in UTC-based `toISOString()` for the date half and produced tomorrow's date next to today's actual local time in the evening.

**`lockPageScroll()` / `unlockPageScroll()`** — `position:fixed` + saved scroll offset for modals, needed since `overflow:hidden` alone isn't reliable in Chrome.

---

## 12. Automated Trading

**`CONFIG.autoTrading`** — `masterEnabled` (default false, local to this device only — export/import forces it off on import, see below), `startHmm`/`endHmm` (buy-only window, default 930/1559, three-layer clamped: HTML `min`/`max`, save-time, restore-time), `investDollars` (default 100, hardcoded ceiling — see below), `evalSecond` (default 59), `maxLossPct` (per-position, default -1), `deadbandPct` (default 0.25, percentage points either side of zero counted as neutral), `maxGainCapDollars`/`maxLossCapDollars` (account-level day caps, default 100 each, range-clamped 0-1000), `dayCapLockoutActive`/`dayCapLockoutSessionKey` (sticky lockout state, not user-editable), `trailingPct` (disabled field, stays `NaN`). `autoTradeEnabledIds` is a separate top-level `Set`, same pattern as `selectedTickerIds`, persisted independently.

**Hardcoded constants** (declared early, alongside `controlsExpanded`, specifically to avoid the temporal-dead-zone `applySavedSettings()` IIFE would otherwise hit reading a `const` declared later in the file): `AUTO_TRADE_MAX_INVEST_DOLLARS` (100, referenced by four independent enforcement points, not settings-editable — raising it means changing this constant directly, never a UI toggle), `AUTO_TRADE_EOD_HMM`/`AUTO_TRADE_EOD_SECOND` (1555/59), `AUTO_TRADE_REGULAR_HOURS_START`/`_END` (930/1559, shared by the evaluator's own execution gate and the blue five-minute cue's display condition — one source of truth so the two can't drift apart), `AUTOTRADE_LOG_GREEN`/`_RED`/`_GREY` (console `%c` badge styles for the four decision-outcome log lines).

**`evaluateAutomatedTrading()`** — the whole feature's core, fired from the existing 1-second refresh timer. Gates, in order: master switch → live-trading-ready → regular trading hours (930-1559, independent of `isLive`'s broader 4am-8pm span) → at least one symbol enabled. Each gate logs why it stopped rather than failing silently. Fail-closed throughout: nested try/catch, any error aborts that pass with no action; one symbol's failure is isolated and doesn't block evaluating the others, but a failure in the shared positions fetch aborts the entire cycle, since nothing downstream can be trusted without it.

Per-symbol, once past the gates: a held position is evaluated for sell first (day-cap lockout, checked first since it short-circuits the rest → per-position max-loss % → crossover), never also considered for buying. A crossover is a *transition*: the current delta bar cleared the deadband in one direction, and the previous bar did **not** clear it in that same direction — "preceded by non-green"/"non-red," not strictly by the opposite color, so a neutral bar in between still counts and there's no need to look further back. Buying additionally requires being within `[startHmm, endHmm]` and not already held; selling and max-loss deliberately ignore that window entirely, since a held position needs an exit at any time the market's open. `classifyDelta()`/`computePctDeltaSeries()` compute the same percentage-point delta Compare's own chart uses (verified numerically to match the full normalize-then-subtract approach), and `buildComboOptions()`'s bar coloring (§5) now uses these same three ranges directly, so what's visible on the chart matches what the logic actually evaluates — a real, closed gap, not just a preference.

**Day caps** — evaluated once per cycle, before the per-symbol loop, using the same `today` figure already shown on the account card (`equity - last_equity`), not a separately-computed number. Crossing either cap sets a sticky, one-way lockout (`dayCapLockoutActive` + a session-keyed timestamp) and sells every bolt-enabled held position individually — not a blanket account-wide liquidate, since manual trading may still be happening alongside the bot during this testing phase, and per-symbol selling can never accidentally catch a manually-held position the bot never touched. The lockout persists through the rest of that trading session regardless of what `today` reads afterward (selling realizes the spread, so the number right after a trigger can land on either side of the threshold that caused it) and resets only when the session key no longer matches the current 4am-anchored session — not at midnight, since Alpaca's own internal reset timing isn't known with confidence.

**End-of-day sell (15:55)** — a second, independent trigger on the same 1-second timer, deliberately a separate `if`, not `else if`, alongside the normal eval-second trigger. The two defaulting to the same second (59) means an `else-if` would let the normal branch silently win the tie and skip the EOD-specific unconditional sell entirely — caught and fixed before shipping. Pre-sets the lockout flag, then calls the exact same `evaluateAutomatedTrading()` unmodified — no separate sell mechanism, since the per-symbol loop already checks that flag first.

**Console logging** — every gate, every per-symbol decision, and the day-cap status log every cycle regardless of whether anything actually happens, so the evaluator's reasoning is fully visible, not just its outcomes. The four decision lines (`BOUGHT`/`SOLD`/`no buy`/`no sell`) render as colored `%c` badges for quick scanning — colors picked for basic readability, not held to the same rigor as an actual UI element, since a console message is a developer aid, not something end users see.

**The bolt toggle** (Compare tiles) — three states, all solid/fully-opaque colors, no `opacity` anywhere: off (grey, transparent), armed (`#426284`, enabled but outside the buy window right now), active (`#5C89B9`, enabled and within it). Armed's color is derived from active using the same proportional dimming ratio already established for `--brand`/`--brand-dim`, not picked arbitrarily. Went through several real iterations on the icon color specifically (dark → `--ink` → white) and the armed state's mechanism (originally `opacity:.45`, which reads as a blurry fade rather than a deliberate color) — each correction driven by a real screenshot, including one case where what looked like a rendering bug for two full rounds turned out to be armed working exactly as designed. The toggle click handler is deliberately unconditional — always works regardless of app state — and triggers a one-time `alert()` (not a blocking `confirm()`) when turning off a symbol that's currently held, since the bolt now also controls sell/max-loss monitoring for that position, not just new buying.

**Safety, specific to real money:**
- The $100 invest cap is enforced at four independent points referencing one constant (HTML `max`, Settings save-time clamp, restore-from-storage clamp, buy execution's own clamp) — proven numerically that even a value which somehow bypassed the earlier layers still can't slip through the last one.
- `TradingAPI.buy()`/`sell()` are called directly from automated logic, never `executeSell()` — that function calls a blocking `confirm()`, which would freeze an unattended page indefinitely waiting for a click that will never come.
- Native browser validation (`checkValidity()`/`reportValidity()`) blocks Save entirely on an out-of-range typed value, showing the real browser tooltip — additive to the existing silent clamps, which still guard the separate path of a value restored from `localStorage` that never touched the dialog.
- Import deliberately forces `masterEnabled` false and clears `autoTradeEnabledIds`/lockout state on any imported settings blob, regardless of what the source device had — export/import predates automated trading and was never built with a second device in mind; without this, importing a workhorse device's settings onto a viewing-only device would silently carry over an armed bot. The numeric configuration (HMM window, invest $, deadband, caps) survives the import untouched, since it's inert without the master switch and useful for a backup or replacement workhorse.
- Manual trading (Buy/Sell/Liquidate) is completely independent of every piece of this — confirmed directly from the code, not assumed — so none of the automated-trading state can ever block or interfere with a manual trade, in either direction.

**Help modal** — a dedicated section, hidden (`display:none`) unless `isLiveTradingReady()` is true at the moment Help is opened, re-checked on every open rather than cached, so the section never describes a feature that couldn't currently do anything.

**Market Watch subtitle** — derived, not a new setting: appends "- PAPER" or "- SAMPLE" based on `dataMode`/whether the account URL contains "paper," computed once at page load only (not re-checked after a Settings save, a deliberate simplification).

**Validated live, with real money, today** — the bot bought (capped at $100) and later sold a position matching the crossover logic exactly as designed. A related scenario — a bot-bought position manually added to afterward — was also confirmed live: the bot correctly continued monitoring the full, blended position, with no way to distinguish its own original share from the manual addition, matching what the code review had already established. End-of-day sell was not exercised today (too early in the session) and remains verified only numerically, not yet live.

---

## History (older entries, newest first, never edited — only appended to)

### V061 — August 16, 2026

Today's session added almost no new *capabilities* — it was a full day of small, precise fixes, and that turned out to be the right way to spend the day before "go time": rounding, timezone handling, list-position preservation, color consistency. None of these show up in a demo; all of them determine whether the tool holds up under real, fast, repeated use.

The clearest throughline across today specifically: **the same "one shared function, applied everywhere" pattern kept paying off, repeatedly, at increasing scale.** `round2()` (already existing) turned out to only be wired into a handful of places — a full audit found **16 separate sites** doing their own raw `>= 0` sign checks, each one a candidate for the exact bug that started the investigation: a value like `-0.001` displaying as `"0.00"` while still coloring red, because the color decision used the *raw* value instead of the *rounded, displayed* one. The fix wasn't 16 individual patches — it was four shared helpers (`signOf`, `signColor`, `signPrefix`, `signClass`, plus a null-aware `upDownNeutral` for the one place "no data yet" needed to stay distinct from "genuinely zero") that every site now routes through. Same shape as `round2()` and `effectiveToday()` before it: find the one true check, make everything else defer to it.

The loss-alert threshold (`CONFIG.lossAlertPct`) is a small but telling example of the same discipline in a different form — one config value drives three separate visual treatments (the POSITIONS stat card's hue, and both the per-row and TOTAL cells on the Positions table), rather than three independently-tuned thresholds that could quietly drift apart.

Two bugs today were caught by reproducing them numerically before trusting a fix, not just asserting the fix was right:
- The page-title auto-naming feature (mirroring a pattern from the user's other apps, for auto-naming printed daily records via the browser's own Print dialog) initially mixed `toISOString()` (always UTC) for the date with `getHours()`/`getMinutes()` (local) for the time — silently showing tomorrow's date next to today's actual local time whenever evening hours crossed into the next UTC calendar day. Reproduced exactly against the user's real timezone before and after the fix.
- Saving a symbol group under an existing name was silently moving it to the end of the row (a `filter()`-then-`push()` implementation, rather than updating in place) — confirmed via a live screenshot, then fixed and reverified.

Also shipped: three new "visual cue" experiments (a steady, non-pulsing five-minute checkpoint highlight on the Today card; solid light-grey hourly annotation lines during regular trading hours; the loss-alert hue), explicitly framed by the user as **candidate conditions for eventual automation** — not decorative. The standing rule going forward: build these consistently with what already exists (steady not pulsing, config-driven thresholds, reuse an existing color's meaning when one genuinely applies) rather than treating each new cue as a fresh design problem.

### Original entry — prior to versioning

A single-file HTML app (`uptick-demo.html`, ~1700 lines of JS) — everything lives in one `<script>` tag.

The throughline across almost every fix that session was **one function, one source of truth, everything else reads from it**: `effectiveToday()` for dates, `getSessionWindow().isLive` for both trading-hours gating *and* historical-date gating, `currentSignature()` for cache invalidation, `TF_DAYS` for timeframe day-counts. Every time a bug showed up, it was almost always because some function had its own independent copy of logic that should have been reading from one of these instead.

Section-by-section coverage at that point: Config & State (before `lossAlertPct`, before persisted accordion state); Date & Session Logic (`effectiveToday()`, `getSessionWindow()`, `getSeriesWindow()`, `applyDisplayWindow()` all already in place); Sample Data Generator; DataSource/TradingAPI/Account (before the Alpaca-direct Backup source rework, before `executeSell()` was extracted as a shared helper); Chart Building (before `hourlyAnnotations()`); Views (four views — Research existed, Positions did not yet); two caching layers; Symbol Groups & Watchlist Management (before the reorder-on-save bug was found); Auto-Refresh (both timers already independent and wall-clock-aligned).

A second regeneration shortly after fixed a naming issue (`accountToggleBtn`/`accountRowExpanded` renamed to `statsToggleBtn`/`statsRowExpanded`, correcting a wrong assumption that `#statRow` was the account cards rather than the view-specific stats row) and added coverage for the Positions view and the historical date picker, both newly built at that point.
