// views.js — one render function per page. Each returns { html, mount }:
// html is the page markup, mount() runs after insertion to draw charts.
// All buttons and inputs are wired by app.js through data-action attributes,
// so every control on every page really works.
import { CATEGORIES, HOUSEHOLD, MONTHLY_TREND, MONTHS } from './data.js';
import {
  categorySpent,
  money,
  moneyShort,
  monthIncome,
  monthSaved,
  monthSpending,
  monthTransactions,
  pct,
  prettyDate,
  totalBudget,
  totalBudgetSpent,
} from './store.js';
import { drawCategoryBars, drawDonut, drawTrendBars } from './charts.js';

export function esc(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function monthLabel(state) {
  return (MONTHS.find((m) => m.key === state.month) || MONTHS[1]).label;
}

function monthSwitcher(state) {
  const idx = MONTHS.findIndex((m) => m.key === state.month);
  const prev = MONTHS[idx - 1];
  const next = MONTHS[idx + 1];
  return `<div class="month-switch" role="group" aria-label="Choose month">
    <button data-action="month" data-month="${prev ? prev.key : ''}" ${prev ? '' : 'disabled'}>${prev ? '← ' + prev.label.split(' ')[0] : '—'}</button>
    <strong>${esc(monthLabel(state))}</strong>
    <button data-action="month" data-month="${next ? next.key : ''}" ${next ? '' : 'disabled'}>${next ? next.label.split(' ')[0] + ' →' : '—'}</button>
  </div>`;
}

function budgetBar(cat, spent, budget) {
  const p = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const over = spent > budget;
  return `<div class="budget-row">
    <div class="budget-head">
      <span><i class="dot" style="background:${cat.color}"></i>${esc(cat.name)}</span>
      <span class="${over ? 'over' : ''}">${money(spent)} of ${money(budget)} · ${p}%</span>
    </div>
    <div class="bar"><i style="width:${p}%;background:${over ? '#b3402e' : cat.color}"></i></div>
    ${over ? `<p class="warn">Over budget by ${money(spent - budget)} this month.</p>` : ''}
  </div>`;
}

function txRow(t) {
  const cat = CATEGORIES.find((c) => c.id === t.category);
  const sign = t.type === 'income' ? '+' : '−';
  return `<li class="tx">
    <span class="tx-dot" style="background:${cat ? cat.color : '#2e6b4f'}"></span>
    <span class="tx-main"><strong>${esc(t.merchant)}</strong><small>${prettyDate(t.date)} · ${cat ? esc(cat.name) : 'Income'}${t.note ? ' · ' + esc(t.note) : ''}</small></span>
    <span class="tx-amount ${t.type}">${sign}${money(t.amount)}</span>
    <button class="icon-btn" data-action="delete-tx" data-id="${t.id}" title="Delete this transaction" aria-label="Delete ${esc(t.merchant)}">×</button>
  </li>`;
}

// ---------------- Dashboard ----------------
export function renderDashboard(state) {
  const m = state.month;
  const income = monthIncome(state, m);
  const spending = monthSpending(state, m);
  const saved = monthSaved(state, m);
  const left = income - spending - saved;
  const recent = monthTransactions(state, m).slice(0, 8);
  const slices = CATEGORIES.filter((c) => c.id !== 'savings')
    .map((c) => ({ label: c.name, value: categorySpent(state, m, c.id), color: c.color }))
    .filter((s) => s.value > 0);
  const upcoming = state.bills.filter((b) => !b.paid).slice(0, 3);
  const budgetsHtml = CATEGORIES.map((c) => budgetBar(c, categorySpent(state, m, c.id), state.budgets[c.id])).join('');

  const html = `
  <section class="page-head">
    <div><h1>Good evening, Maple household</h1>
    <p class="sub">${esc(HOUSEHOLD.members)} · ${esc(monthLabel(state))} · all figures update as you edit.</p></div>
    ${monthSwitcher(state)}
  </section>
  <section class="stats">
    <div class="stat"><small>Income</small><strong>${money(income)}</strong><span>in ${esc(monthLabel(state))}</span></div>
    <div class="stat"><small>Spending</small><strong>${money(spending)}</strong><span>excluding savings</span></div>
    <div class="stat"><small>Saved</small><strong>${money(saved)}</strong><span>${pct(saved, income)}% of income</span></div>
    <div class="stat highlight"><small>Left to spend</small><strong>${money(left)}</strong><span>income − spending − saved</span></div>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Where ${esc(monthLabel(state).split(' ')[0])}’s money went</h2>
      <canvas id="donut" width="320" height="220" aria-label="Donut chart of spending by category"></canvas>
      <ul class="legend">${slices.map((s) => `<li><i class="dot" style="background:${s.color}"></i>${esc(s.label)} <b>${money(s.value)}</b></li>`).join('')}</ul>
    </div>
    <div class="card">
      <h2>Budget check-in</h2>
      ${budgetsHtml}
      <p class="card-link"><a href="#/budgets">Adjust budgets →</a></p>
    </div>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Recent transactions</h2>
      <ul class="tx-list">${recent.map(txRow).join('')}</ul>
      <p class="card-link"><a href="#/transactions">See all transactions →</a></p>
    </div>
    <div class="card">
      <h2>Savings goals</h2>
      ${state.goals.map((g) => `<div class="goal-mini">
        <div class="goal-head"><strong>${esc(g.name)}</strong><span>${money(g.saved)} of ${money(g.target)}</span></div>
        <div class="bar"><i style="width:${pct(g.saved, g.target)}%;background:${g.color}"></i></div>
      </div>`).join('')}
      <h2 class="mt">Bills coming up</h2>
      <ul class="bill-mini">${upcoming.map((b) => `<li><span>${esc(b.name)}</span><b>${money(b.amount)}</b><small>due ${prettyDate(b.due)}</small></li>`).join('')}</ul>
      <p class="card-link"><a href="#/bills">See all bills →</a></p>
    </div>
  </section>`;

  return {
    html,
    mount() {
      drawDonut(document.getElementById('donut'), slices, 'spent', moneyShort(spending));
    },
  };
}

// ---------------- Transactions ----------------
export function renderTransactions(state, filter) {
  const m = state.month;
  let list = monthTransactions(state, m);
  const spent = list.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  if (filter.category) list = list.filter((t) => t.category === filter.category);
  if (filter.type) list = list.filter((t) => t.type === filter.type);
  if (filter.q) {
    const q = filter.q.toLowerCase();
    list = list.filter((t) => (t.merchant + ' ' + (t.note || '')).toLowerCase().includes(q));
  }
  const catOptions = CATEGORIES.map((c) => `<option value="${c.id}" ${filter.category === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  const html = `
  <section class="page-head"><div><h1>Transactions</h1>
  <p class="sub">${esc(monthLabel(state))} · ${list.length} shown · ${money(spent)} spent in total this month.</p></div>
  ${monthSwitcher(state)}</section>
  <section class="card">
    <h2>Add a transaction</h2>
    <form id="add-tx" class="form-grid">
      <label>Date <input type="date" name="date" value="${state.month}-28" required></label>
      <label>Merchant / description <input type="text" name="merchant" placeholder="e.g. GreenMart" required maxlength="80"></label>
      <label>Category <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}<option value="">Income — no category</option></select></label>
      <label>Type <select name="type"><option value="expense">Expense</option><option value="income">Income</option></select></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Note <input type="text" name="note" placeholder="Optional note" maxlength="80"></label>
      <button class="btn" type="submit">Add transaction</button>
    </form>
  </section>
  <section class="card">
    <h2>Filter</h2>
    <div class="filter-row">
      <label>Search <input type="search" id="filter-q" placeholder="Search merchant or note…" value="${esc(filter.q || '')}"></label>
      <label>Category <select id="filter-cat"><option value="">All categories</option>${catOptions}</select></label>
      <label>Type <select id="filter-type"><option value="">Income &amp; expenses</option><option value="expense" ${filter.type === 'expense' ? 'selected' : ''}>Expenses only</option><option value="income" ${filter.type === 'income' ? 'selected' : ''}>Income only</option></select></label>
      <button class="btn ghost" data-action="clear-filters">Clear</button>
    </div>
    ${list.length ? `<ul class="tx-list">${list.map(txRow).join('')}</ul>` : '<p class="empty">No transactions match these filters. Try clearing them.</p>'}
  </section>`;
  return { html, mount() {} };
}

// ---------------- Budgets ----------------
export function renderBudgets(state) {
  const m = state.month;
  const budgeted = totalBudget(state);
  const spent = totalBudgetSpent(state, m);
  const cards = CATEGORIES.map((c) => {
    const s = categorySpent(state, m, c.id);
    const b = state.budgets[c.id];
    const p = b ? Math.min(100, Math.round((s / b) * 100)) : 0;
    const over = s > b;
    return `<div class="card budget-card">
      <div class="budget-head"><span><i class="dot" style="background:${c.color}"></i><strong>${esc(c.name)}</strong></span>
      <span class="${over ? 'over' : ''}">${money(s)} / ${money(b)}</span></div>
      <div class="bar big"><i style="width:${p}%;background:${over ? '#b3402e' : c.color}"></i></div>
      <p class="budget-note">${over ? `Over by ${money(s - b)} — trim something here or raise the budget.` : `${money(Math.max(0, b - s))} left · ${p}% used`}</p>
      <label class="slider-label">Monthly budget: <b data-budget-value="${c.id}">${money(b)}</b>
        <input type="range" min="0" max="2500" step="10" value="${b}" data-action="set-budget" data-category="${c.id}" aria-label="Monthly budget for ${esc(c.name)}">
      </label>
    </div>`;
  }).join('');
  const html = `
  <section class="page-head"><div><h1>Budgets</h1>
  <p class="sub">${esc(monthLabel(state))} · drag a slider and the totals, the dashboard and the charts all update.</p></div>
  ${monthSwitcher(state)}</section>
  <section class="stats">
    <div class="stat"><small>Total budgeted</small><strong>${money(budgeted)}</strong><span>all categories</span></div>
    <div class="stat"><small>Spent so far</small><strong>${money(spent)}</strong><span>including savings</span></div>
    <div class="stat highlight"><small>Still in the budget</small><strong>${money(Math.max(0, budgeted - spent))}</strong><span>${pct(spent, budgeted)}% of the plan used</span></div>
  </section>
  <section class="grid-3">${cards}</section>`;
  return { html, mount() {} };
}

// ---------------- Goals ----------------
export function renderGoals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  const cards = state.goals.map((g) => {
    const p = pct(g.saved, g.target);
    return `<div class="card goal-card">
      <h2>${esc(g.name)}</h2>
      <p class="sub">${esc(g.detail)}</p>
      <div class="goal-big"><strong>${money(g.saved)}</strong><span> of ${money(g.target)} · ${p}%</span></div>
      <div class="bar big"><i style="width:${p}%;background:${g.color}"></i></div>
      <p class="budget-note">${g.saved >= g.target ? 'Goal reached — well done!' : `${money(g.target - g.saved)} to go.`}</p>
      <form class="goal-form" data-goal="${g.id}">
        <label>Add to this goal ($) <input type="number" name="amount" min="1" step="1" value="50" required></label>
        <button class="btn" type="submit">Add money</button>
      </form>
      <div class="quick-add">
        ${[25, 50, 100].map((a) => `<button class="chip" data-action="goal-quick" data-goal="${g.id}" data-amount="${a}">+$${a}</button>`).join('')}
      </div>
    </div>`;
  }).join('');
  const html = `
  <section class="page-head"><div><h1>Savings goals</h1>
  <p class="sub">Three things the Maple household is saving for — ${money(totalSaved)} of ${money(totalTarget)} put aside so far.</p></div></section>
  <section class="grid-3">${cards}</section>
  <section class="card tip"><h2>How the household saves</h2>
  <p>Payday comes first: $800 moves to savings on the 1st, before any spending. The emergency fund is the priority — once it hits $10,000, the same $800 a month goes to the car fund. Small top-ups count: $25 a week into the vacation jar is $1,300 a year.</p></section>`;
  return { html, mount() {} };
}

// ---------------- Bills ----------------
export function renderBills(state) {
  const unpaid = state.bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const rows = state.bills.map((b) => `<li class="bill ${b.paid ? 'paid' : ''}">
    <span class="bill-main"><strong>${esc(b.name)}</strong><small>Due ${prettyDate(b.due)} · ${esc(b.recurring)}${b.autopay ? ' · autopay on' : ''}</small></span>
    <span class="bill-amount">${money(b.amount)}</span>
    <button class="btn ${b.paid ? 'ghost' : ''}" data-action="toggle-bill" data-id="${b.id}">${b.paid ? 'Paid ✓ — undo' : 'Mark paid'}</button>
  </li>`).join('');
  const html = `
  <section class="page-head"><div><h1>Bills</h1>
  <p class="sub">December’s fixed bills for the Maple household. Mark one paid and the totals below update.</p></div></section>
  <section class="stats">
    <div class="stat"><small>Still to pay</small><strong>${money(unpaidTotal)}</strong><span>${unpaid.length} of ${state.bills.length} bills unpaid</span></div>
    <div class="stat"><small>Next due</small><strong>${unpaid.length ? prettyDate(unpaid[0].due) : 'All paid'}</strong><span>${unpaid.length ? esc(unpaid[0].name) : 'Nothing left this month'}</span></div>
    <div class="stat highlight"><small>Paid so far</small><strong>${money(state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0))}</strong><span>out of ${money(state.bills.reduce((s, b) => s + b.amount, 0))} total</span></div>
  </section>
  <section class="card"><h2>December bills</h2><ul class="bill-list">${rows}</ul></section>`;
  return { html, mount() {} };
}

// ---------------- Reports ----------------
export function renderReports(state) {
  const m = state.month;
  const cats = CATEGORIES.filter((c) => c.id !== 'savings')
    .map((c) => ({ label: c.name, spent: categorySpent(state, m, c.id), color: c.color }))
    .sort((a, b) => b.spent - a.spent);
  const income = monthIncome(state, m);
  const spending = monthSpending(state, m);
  const saved = monthSaved(state, m);
  const rate = pct(saved, income);
  const top = cats[0];
  const biggest = monthTransactions(state, m)
    .filter((t) => t.type === 'expense' && t.category !== 'savings')
    .sort((a, b) => b.amount - a.amount)[0];
  const over = CATEGORIES.filter((c) => categorySpent(state, m, c.id) > state.budgets[c.id]);
  const html = `
  <section class="page-head"><div><h1>Reports</h1>
  <p class="sub">Five months of the Maple household’s money, and where ${esc(monthLabel(state))} stands.</p></div>
  ${monthSwitcher(state)}</section>
  <section class="grid-2">
    <div class="card"><h2>Income vs spending · Jul–Nov 2026</h2>
      <canvas id="trend" width="520" height="240" aria-label="Bar chart of monthly income versus spending"></canvas>
      <p class="legend-line"><i class="dot" style="background:#2e6b4f"></i>Income <i class="dot" style="background:#c96f3f"></i>Spending</p>
    </div>
    <div class="card"><h2>What ${esc(monthLabel(state))} says</h2>
      <ul class="insights">
        <li><strong>Biggest category:</strong> ${esc(top.label)} at ${money(top.spent)} — rent is fixed, so the lever is groceries and dining.</li>
        <li><strong>Savings rate:</strong> ${rate}% of income (${money(saved)} of ${money(income)}) — above the household’s 10% target.</li>
        <li><strong>Biggest single expense:</strong> ${biggest ? esc(biggest.merchant) + ' — ' + money(biggest.amount) + ' on ' + prettyDate(biggest.date) : '—'}.</li>
        <li><strong>Over budget:</strong> ${over.length ? over.map((c) => esc(c.name)).join(', ') + ' — worth a look before December.' : 'nothing. Every category is inside its budget.'}</li>
        <li><strong>Five-month trend:</strong> spending is down from $4,380 in August to ${money(spending)} in November while income held steady.</li>
      </ul>
    </div>
  </section>
  <section class="card"><h2>Spending by category · ${esc(monthLabel(state))}</h2>
    <canvas id="catbars" width="520" height="300" aria-label="Horizontal bar chart of spending by category"></canvas>
  </section>`;
  return {
    html,
    mount() {
      drawTrendBars(document.getElementById('trend'), MONTHLY_TREND);
      drawCategoryBars(document.getElementById('catbars'), cats);
    },
  };
}
