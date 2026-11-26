// store.js — the household's data layer. Loads the seed from data.js on
// first visit, then keeps every edit in localStorage so the budget survives
// a reload. All views read through here; nothing else touches storage.
import { CATEGORIES, SEED_BILLS, SEED_GOALS, SEED_TRANSACTIONS } from './data.js';

const STORAGE_KEY = 'hearth-ledger-v1';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultState() {
  return {
    month: '2026-11',
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
    transactions: clone(SEED_TRANSACTIONS),
    goals: clone(SEED_GOALS),
    bills: clone(SEED_BILLS),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.transactions) return defaultState();
    return parsed;
  } catch (_err) {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_err) {
    // Storage full or blocked: the app keeps working in memory.
  }
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return defaultState();
}

export function monthTransactions(state, monthKey) {
  return (state.transactions[monthKey] || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function monthIncome(state, monthKey) {
  return monthTransactions(state, monthKey)
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function monthSpending(state, monthKey) {
  return monthTransactions(state, monthKey)
    .filter((t) => t.type === 'expense' && t.category !== 'savings')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function monthSaved(state, monthKey) {
  return monthTransactions(state, monthKey)
    .filter((t) => t.type === 'expense' && t.category === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function categorySpent(state, monthKey, categoryId) {
  return monthTransactions(state, monthKey)
    .filter((t) => t.type === 'expense' && t.category === categoryId)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function totalBudget(state) {
  return CATEGORIES.reduce((sum, c) => sum + (state.budgets[c.id] || 0), 0);
}

export function totalBudgetSpent(state, monthKey) {
  return CATEGORIES.reduce((sum, c) => sum + categorySpent(state, monthKey, c.id), 0);
}

export function addTransaction(state, tx) {
  const list = state.transactions[state.month] || (state.transactions[state.month] = []);
  list.push({ id: 'u' + Date.now().toString(36), ...tx });
  saveState(state);
}

export function deleteTransaction(state, id) {
  for (const key of Object.keys(state.transactions)) {
    state.transactions[key] = state.transactions[key].filter((t) => t.id !== id);
  }
  saveState(state);
}

export function setBudget(state, categoryId, amount) {
  state.budgets[categoryId] = Math.max(0, Math.round(amount));
  saveState(state);
}

export function addToGoal(state, goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;
  goal.saved = Math.min(goal.target, Math.round((goal.saved + amount) * 100) / 100);
  saveState(state);
}

export function toggleBillPaid(state, billId) {
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill) return;
  bill.paid = !bill.paid;
  saveState(state);
}

export function money(amount) {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function moneyShort(amount) {
  if (amount >= 1000) return '$' + (amount / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return '$' + Math.round(amount);
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function prettyDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
