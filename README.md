# Hearth Ledger — Household Budget Site

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457/?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/sage-otter-44/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457/?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/sage-otter-44/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457/?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[Make the best household budget site on make.fun](https://make.fun/c/best-household-budget-site-20261126-1457/?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Hearth Ledger is a household budget site for one family — the Maples — that
runs entirely offline from static files, on a desktop and on a phone. No
framework, no network requests, no build step: open `app/index.html` in a
browser and it works.

## What it does

- **Dashboard** — income, spending, savings and what is left to spend for the
  month, a hand-drawn donut of spending by category, budget check-in bars,
  recent transactions, savings goals and upcoming bills.
- **Transactions** — the full month's ledger. Search, filter by category and
  type, add a transaction (income or expense) and delete one; every total,
  budget bar and chart updates.
- **Budgets** — one card per category with a slider. Drag it and the totals,
  the dashboard and the reports all follow. Over-budget categories are flagged
  in red.
- **Savings goals** — emergency fund, family vacation and a car down payment,
  with quick-add buttons and a custom amount.
- **Bills** — December's fixed bills with due dates, autopay flags and a
  "Mark paid" toggle that updates the still-to-pay total.
- **Reports** — income vs spending for Jul–Nov 2026 (hand-drawn bar chart),
  spending by category, and plain-language insights: biggest category,
  savings rate, biggest single expense and what is over budget.

Everything is saved in the browser's localStorage, so edits survive a reload;
"Reset example data" in the header restores the Maple household's example
figures. Switch between October and November 2026 from any page's month
switcher.

## Layout

| File | Job |
| --- | --- |
| `app/index.html` | Page shell: header, nav, footer, script tag |
| `app/styles.css` | All styling, including the phone layout |
| `app/data.js` | Seed data: household, categories, transactions, goals, bills, trend |
| `app/store.js` | State, localStorage, totals and edits |
| `app/charts.js` | Hand-drawn canvas charts (donut, trend bars, category bars) |
| `app/views.js` | One render function per page |
| `app/app.js` | Hash router and the one delegated event handler |
| `main.ts` | Hand-in program: copies app/ + screenshots/ and writes dossier.json |
| `vendor/makefun-frontend.ts` | Kit library, copied unchanged |

## Run it locally

```sh
python3 -m http.server 8080 --directory app
# open http://localhost:8080
```

Build the hand-in output:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
