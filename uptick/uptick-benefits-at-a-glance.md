# Uptick — Benefits at a Glance

*Updated August 25, 2026 — after the app's first fully unsupervised trading day.*

---

## The core idea

> **The bot doesn't need to be smarter than you were on your good days. It only needs to not have your bad ones.**

This app didn't start from a generic trading strategy. It started from real, sustained *manual* trading experience — a proven 0.75%/day average, achieved over many weeks with a prior version of this same approach. The bad days in that manual history weren't evidence the strategy tops out lower. They were ordinary human inconsistency: missing the boring trade, over-reacting to the loud one. Uptick exists to remove exactly those two things — nothing more.

---

## Momentum, not gut feel

Every symbol is read the same way, every time — how far price has moved from its own trend line, in the same percentage terms regardless of whether the stock is $20 or $800. No squinting at raw price charts trying to eyeball whether a move is real.

## Catches what you'd miss, not just what you'd catch anyway

A slow, quiet climb that never sparks manual interest — the bot doesn't get bored. An already-established trend, not just a fresh flip — it checks "is this true right now," not "did something just change."

## Loses less than you would, on the hard days

Proven twice now, not just designed. On a genuinely rough trading day, the honest read was that manual trading likely would have fared worse — not because the bot is smarter, but because it doesn't get tired, doesn't tilt after a bad trade, and doesn't skip the boring exit because something else looked more interesting.

## Confirmed live, with no one watching

**August 24 was the app's first fully unsupervised trading day — no ability to intervene — during a real, scheduled market-moving event.** Every actively-traded symbol ended that day negative on raw price. The account still closed positive: a real, independently-verified gain, computed directly from Alpaca's own account activity, matching the day's own report almost exactly. The safety net that had never actually been needed before finally ran completely on its own — and held.

## A safety net with real teeth, not decoration

A hard dollar cap on every position that can't be bypassed even by a stale setting. Day-wide gain and loss limits that actually stop trading, not just warn. A last-resort end-of-day close so nothing rides overnight by accident. Deliberately conservative settings on that first unsupervised day — smaller position size, tighter day caps, a buy window pushed past the event's own immediate reaction — reflected exactly the same self-discipline the whole system was built to encode: don't need to be smarter than your best day, just don't repeat your worst one.

## You stay the pilot

Manual trading is never touched by any of this — buy or sell by hand any time, for any reason. Worth being upfront about the flip side, though: if a symbol's bolt is left on, the bot *will* act on any position in it, including one you opened yourself, since it has no way to tell the two apart. Turning a bolt off is the one deliberate control for "hands off this position" — the toggle itself always succeeds, no confirmation or delay, taking effect on the bot's very next check. A day you already know is going to be bad, you can just say so, and undo that call in one tap if you're wrong.

## Watching your account, not just the market

It knows the difference between "the market closed for the day" (routine, expected, no alarm) and "we hit a real gain or loss limit" (worth a visual flag).

## Built to be checked, not just trusted

Every decision — bought, sold, skipped, why — is visible in real time, not a black box. A full accounting of the day's completed trades, pulled directly from the broker's own records, so nothing has to be reconstructed from memory or a console log that's already scrolled away.

---

## Why this matters

The goal was never to build something that trades better than a machine could. It was to take a strategy already proven to work — by hand, imperfectly, over many real weeks — and remove the one variable that was capping it below its own ceiling: being human. Not more talented. Just more consistent.