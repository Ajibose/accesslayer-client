# WIP tracker: key detail/portfolio buy UX batch

Tracking doc for the 4 issues in this PR. Implementation in progress.

## #873 — Buy cooldown countdown on the key detail page
Show a countdown on the key detail page indicating when the authenticated
user can next buy, once a per-user buy cooldown is in effect.

## #875 — Key simulation tool on the key detail page
Let users model different buy scenarios (amount, expected price impact)
on the key detail page before committing to a real buy.

## #872 — Slippage tolerance settings in buy/sell modals
Wire `max_price`/`min_price` slippage tolerance into the buy and sell
modals' contract calls.

## #871 — Key deprecation notice + redeem button on the portfolio page
Surface a deprecation notice and redeem action on the portfolio page for
keys that have been deprecated.

---
Branch: `feat/buy-cooldown-key-simulation-slippage-tolerance-deprecation-notice`
