# Uptick — Code Summary (V098)

**Previous summary:** V092 (2026-08-30 session)
**This summary:** V098 (2026-09-02 session) — 5,663 lines
**Working file:** `/home/claude/uptick-demo.html` and `/mnt/user-data/outputs/uptick-demo.html`
**STABLE snapshot:** `/mnt/user-data/outputs/uptick-demo-STABLE-V098.html`

This gap (V092 → V098) was deliberate on the user's part — no summary was requested during active iteration, only now that two major new trading-logic mechanisms have been built *and validated live* across a full trading day.

---

## Architecture (unchanged)
Single self-contained HTML file. No framework. ApexCharts 3.45.2 (CDN), w3.css, Font Awesome 4.6.0. Everything in `localStorage` key `uptick-settings-v1`. A second, fully independent `localStorage` key `uptick-journal-v1` holds Journal data (see below) — deliberately separate so it isn't swept into Export/Import or rewritten on every settings save.

---

## Major features added since V092

### 1. Theoretical-gain "Potential" label (Compare + Research)
After multiple failed attempts in the prior session (abandoned, reset to V091), the user independently wrote and tested their own version overnight. Claude's role was **review, not authorship**: traced the user's function against constructed edge cases and found two real bugs —
- `!start` is true for both `null` and `0` in JS, so a window opening at the very first bar of the array was silently mishandled (fixed with a proper `inWindow` boolean).
- A window still open at the end of the series was silently dropped instead of closing out at the last bar (fixed to match the aligned premise).

Final function: `computeTheoreticalGainPct(times, close, deltaPct, deadbandPct, negDeadbandPct)` (line 2136). Filters to regular trading hours (9:30 AM–3:55 PM), sums per-window close% deltas (first green bar opens a window, next red bar closes it), verified against the user's own hand-worked example (0.88) and against real MU/SOXL data pulled via the new Research dump feature (see below).

Displayed as "Potential: ▲/▼ X.XX%" on both Compare tiles and Research, using the same deadband resolution `buildComboOptions()` itself uses for bar coloring.

### 2. Journal (Account view + Positions echo)
A per-day free-text note, persisted in its own `uptick-journal-v1` key (`{"YYYY-MM-DD": "note text"}`), read once at load into `journalEntries`.
- **Location**: lives directly inside Account, below the daily-gains chart — not a separate nav view — after a design discussion that concluded a printout of Account should naturally capture both the day's numbers and the day's note together. `renderJournal(container)` (line 4487) takes a container parameter, called from `renderAccountView()`.
- **Editing**: only today's row is editable (plain textarea, placeholder "What happened today?"), freely re-savable any number of times while it's still today; locks to permanent read-only the moment the calendar date changes. Table shows every date *with* a note, most-recent first, no fixed cap.
- **Positions echo**: today's entry also echoes read-only on Positions, right above the account-activity table (`renderPositionsJournalEcho()`, line 4208) — motivated by the user's actual daily habit of printing Positions at day's end; the echo makes a printout self-contained (day's numbers + day's context on one page). Hidden entirely on days with no note.
- **Real bug found and fixed during this build**: Account was made to bypass the view-signature cache so the journal wouldn't show stale data — but this accidentally made the *periodic* chart-refresh timer rebuild the entire Account panel every ~15 seconds, destroying the textarea's DOM (and whatever was typed) mid-edit. Reverted Account back into the normal cache; the Save button already re-renders the journal directly, so the cache was never actually needed for freshness.

### 3. "Buy today" toggle — renamed and inverted
The old "No buy today" toggle used negative framing (ON = blocked) that directly caused two real, costly mistakes — an accidental buy from misreading the toggle, needing a manual liquidate to fix. Renamed to "Buy today," inverted so ON = buying allowed (matching the master switch's own "on = active" convention). The underlying `manualNoBuyToday` config field keeps its original name/meaning (`true` = blocked) — only the UI label, toggle-populate comparison, and save-handler read were inverted.

### 4. Modal click-outside-to-close removed (Settings + Automated Trading)
A separate real incident: closing the Automated Trading dialog by clicking outside it (after toggling a field but before hitting Save) looked identical to having saved successfully. Removed click-outside-to-close specifically on Settings and Automated Trading — Close/Cancel/Save remain as explicit actions. Calculator and Help were deliberately left unchanged (lower stakes).

### 5. Activity-summary pairing bug — found and fixed using real user data
The Positions view's daily round-trip table was producing wildly implausible "gains" (+$997.81, +$1993.52 on ordinary ~$1000 positions). Traced against the user's own real Alpaca activity JSON: the old pairing logic assumed strict 1-to-1 buy→sell alternation, and a day mixing manual trades (including a liquidate) with the bot's own buys produced several consecutive buys before one combined sell — silently orphaning all but the last buy and attributing the *entire* combined sell against just that one. Fixed `computeActivitySummary()` (line 2797) to accumulate all consecutive buys since the last sell, then pair the combined total against the next sell. Re-verified against the same real data: MU's Best Win dropped from a false +$997.81 to a genuine +$0.05; the day's true total flipped from a false +$4163.58 to an honest -$36.36.

### 6. Research "Dump to console" button
Originally a persistent checkbox (auto-logging on every render), simplified after live use to a plain button — no stored state, independently fetches/computes the same data `renderResearch()` uses at the moment it's clicked. Logs symbol, timeframe, raw and %-normalized close/SMA series, delta, a human-readable `timesLabel` array, and the bot's own settings in effect (SMA period, deadband, buy window, max loss) — enough context that a described bar ("grey bar after 10:30") can be traced precisely without assuming anything about current settings. This tool is what made the user's own real-data validation of the theoretical-gain fix, the activity-summary bug, and both #6 and Gain Pause possible.

### 7. 4 AM trading-day boundary — two real timing fixes
- **View-force**: at the real 4am boundary, if the app is left open overnight on some other view/timeframe, it now automatically forces Compare/Today/Last 6H — tracked via `lastViewForceSessionKey`, initialized to the *current* session at script-load so it never fires on a plain page load, only a genuine overnight transition.
- **Stale-session reset timing**: the "Buy today" and day-cap-lockout stale-session resets used to live inside `evaluateAutomatedTrading()`, which returns immediately before 9:30am — meaning neither reset could ever fire before the evaluator's first tick, regardless of the real 4am boundary. Extracted into `resetStaleSessionFlags()` (line 2262), called unconditionally from the existing once-a-minute timer. Confirmed as the likely cause of a real prior-day incident (a deliberate "off" setting silently undone at 9:30:55am).

### 8. Orange evaluating-cycle console log
`[AutoTrade] evaluating cycle` now shows in orange (reusing the app's existing SMA accent color, `#F5A623`) to visually mark where each new cycle starts in a busy console. Dark text verified via contrast ratio (8.95:1) — white would have been worse (2.03:1) than the already-rejected green.

---

## #6 — Logic-based Start HMM (validated live, full trading day)

**Function**: `isSymbolArmedForBuy(times, deltaPct, startHmm)` (line 2101).

**Purpose**: automates the user's own long-standing manual habit — wait for a confirmed red bar before enabling the bolt each morning — so the bot can run genuinely unsupervised without buying into the tail end of an already-aging move.

**Mechanism**: stateless, re-scanned fresh every evaluation cycle. Scans the symbol's own series from the *current* Start HMM value forward to now, looking for at least one genuine closed red bar (excludes the still-forming last bar, same `-1`/`-2` convention used everywhere else). Applies only to new buys — never touches selling.

**Console indicator**: a distinct blue badge (`AUTOTRADE_LOG_BLUE`, reusing the app's existing informational blue) logs "bot is watching, waiting for a red bar" for any not-yet-armed symbol — added specifically so the bot's actual internal state could be watched directly during live validation, rather than inferred.

**Pre-build validation**: traced against three real Research dumps (MU, SOXL) before writing code — a real ~2.4% MU move and ~5.4% SOXL move that would have been missed entirely without the gate; a hypothetical 11:00 entry with no gate took a confirmed -0.79% loss on the very next bar, while the same setup with the gate applied waited for the real red-then-green sequence and turned into a +1.37% gain.

**Live validation (full trading day)**: all six watchlist symbols independently found their own confirming red bars at different times; a mid-day Start HMM adjustment (moved from 932 to 1035 after a deliberate day-cap test) was picked up correctly with zero special-case behavior, confirming the stateless design works exactly as intended for the "adjust Start HMM after a cap trips, mid-day" scenario discussed before building.

---

## Gain Pause (built and validated live, full trading day)

**Purpose**: automates a second, different manual pattern — once a group of currently-held positions' combined gain nears/crosses a threshold, the move is statistically likely near its end; take the win. Explicitly *not* a real trailing stop (no peak tracking) and explicitly repeatable within one day (not a lockout).

**Reuses #6's own mechanism rather than building a parallel system**: the buy-gate call became `isSymbolArmedForBuy(seriesTimes, deltaPctSeries, Math.max(CONFIG.autoTrading.startHmm, CONFIG.autoTrading.lastGainPauseHmm || 0))` (line ~2483) — Gain Pause simply raises the effective re-arm floor beyond Start HMM whenever it has fired later in the day. No new per-symbol state needed.

**New CONFIG fields** (`CONFIG.autoTrading`):
- `gainPausePct` — NaN/0 = disabled (the off switch), optional
- `lastGainPauseHmm` — HMM value (same units as `startHmm`), null if not fired today
- `lastGainPauseSessionKey` — 4am-boundary reset tracking, same pattern as `dayCapLockoutSessionKey`

**The trigger check** (inside `evaluateAutomatedTrading()`, right after the day-cap trigger block): checked once per cycle against `accountInfo.positionsPct` (the Positions card's own existing, live, dollar-weighted, unrealized-only %) — no new calculation needed. Day cap is checked first and always wins (if both conditions are met in the same cycle, day cap's full lockout takes precedence). On trigger: sells every bolt-enabled held position via its own self-contained loop (deliberately *not* reusing the day-cap's per-symbol sell check, since Gain Pause never sets `dayCapLockoutActive`), records the trigger HMM and session key.

**Console indicator**: new white-background/dark-text badge (`AUTOTRADE_LOG_WHITE`, 18.15:1 contrast — the only inverted-color badge among green/red/grey/orange/blue) — used for the trigger event itself and for each symbol's "waiting because of Gain Pause" state, distinct from the plain blue Start-HMM message.

**Two real bugs caught and fixed during the build** (both before shipping):
- `tradedThisCycle` referenced inside the gain-pause block before its own `let` declaration — a temporal-dead-zone error caught by the syntax check, fixed by reordering.
- (From the #6 build the day before, same class of issue, for context): `series`/`deltaPct` originally declared `const` inside a `try` block, referenced outside it — fixed by hoisting to `seriesTimes`/`deltaPctSeries` at the outer scope.

**Pre-build data limitation, stated honestly**: individual-symbol Research dumps cannot validate the aggregate `positionsPct` trigger the way they validated #6's per-symbol logic — `positionsPct` is only ever computed at the current moment, never exported as a time series, and depends on position sizes/simultaneous holdings the chart data doesn't capture. This was explicitly acknowledged before building; the threshold itself was treated as something to tune from live observation, same as `maxLossPct` was tuned after seeing -0.3% fire too eagerly on a live day.

**Live validation (full trading day, threshold set deliberately low at 0.3% specifically to observe the mechanism, not to represent the eventual real setting)**:
- Fired multiple times, each time selling correctly and each symbol independently re-arming on its own schedule.
- A clean case where SOXL alone (the only symbol then held) tripped the aggregate threshold, sold, and all six symbols correctly waited — while the whole group then drifted down with the bot correctly not buying into it, since nothing had re-armed. Direct confirmation that the group-wide pause (not scoped per-triggering-symbol) worked as specified.
- End-of-day activity table: 24 trades, 16 wins / 8 losses (2:1 ratio), +$42.11 total, +$1.75 average/trade — including one real, honest case of the design's known tradeoff (SOXL's Gain Pause win followed by a losing re-entry) and a new symbol (SMCI) recovering from an early 0/3 stretch to 1/3 after enough trades accumulated, illustrating why the user is deliberately not making single-day judgments on a new symbol yet.

---

## Smaller additions (V098)
- **`SOLD (max loss)` console message** now includes the actual loss % (`pos.pct` was already available at that point, just not logged).
- **Table view "vs. Yesterday" column**, positioned before "Δ ($)" — same aqua indicator and exact formula as Compare's own previous-close comparison (not the raw dollar price, after user feedback that the raw price wasn't useful). Required an alignment fix: this specific table (`.today-table`) has its own CSS overriding the generic `.data-table` right-align convention, so the new column needed to explicitly *not* be right-aligned to match its neighbors.

---

## Key CONFIG additions (full list, this session)

```js
CONFIG.autoTrading.manualNoBuyToday        // unchanged internally; UI now shows inverted as "Buy today"
CONFIG.autoTrading.gainPausePct            // NaN/0 = disabled
CONFIG.autoTrading.lastGainPauseHmm        // HMM value, null = not fired today
CONFIG.autoTrading.lastGainPauseSessionKey // 4am-boundary reset tracking
```

```js
JOURNAL_KEY = "uptick-journal-v1"  // separate localStorage key, not part of CONFIG at all
let journalEntries = {};          // { "YYYY-MM-DD": "note text" }
```

## Key functions (new/modified, this session)

| Function | Line (approx.) | Purpose |
|---|---|---|
| `computeTheoreticalGainPct()` | 2136 | User-authored, Claude-reviewed. Powers the "Potential" label. |
| `isSymbolArmedForBuy()` | 2101 | #6's core gate. Reused by Gain Pause via `Math.max()`. |
| `resetStaleSessionFlags()` | 2262 | Unconditional 4am-boundary reset for "Buy today" + day-cap + Gain Pause markers. |
| `computeActivitySummary()` | 2797 | Fixed buy/sell pairing (accumulate-then-pair, not strict alternation). |
| `renderJournal(container)` | 4487 | Takes a container param; called from Account. |
| `renderPositionsJournalEcho()` | 4208 | Read-only echo on Positions. |

---

## Real-world validation status (through V098)
- **#6**: validated across a full live trading day, multiple symbols, mid-day Start HMM adjustment confirmed working statelessly.
- **Gain Pause**: validated across the same full live trading day, multiple trigger/re-arm cycles, the group-wide-pause design decision directly confirmed useful in a real scenario (SOXL-alone case).
- Both were deliberately tested with small capital first, per the user's own stated approach — same discipline as everything else in this project ("income, not compounding").

---

## Pending items (current list, six open)
1. Trailing-stop discussion — largely superseded by Gain Pause; may still be worth revisiting with Gain Pause's own live data now available.
2. Whether the "Potential" label should use the existing buy/sell HMM window from Settings instead of its own hardcoded 930–1555 filter — user testing independently.
3. Negative-deadband field should accept a signed value directly (consistency with Max Loss/Gain-Protect Cap's own +/- convention) — touches several call sites, deliberately deferred to its own pass.
4. Nested treemap view, inspired by an ApexCharts demo — future exploration, no urgency.
5. Sync to/from server — user's own API written and tested locally; details to follow once deployed.

---

## Workflow rules (unchanged)
- Every code edit: JS syntax check + HTML structure check immediately after.
- STABLE snapshot: only on explicit user request, full validation, version bump, remove previous STABLE.
- Working copy vs STABLE: all changes land in working copy only by default.
- Code summary: generated on explicit request, not automatically — this session's gap (V092→V098) was deliberate.
