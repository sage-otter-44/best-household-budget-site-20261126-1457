// app.js — entry point. Hash router (#/dashboard, #/transactions, …),
// one delegated click/change/submit handler for every control, and the
// render loop: any edit saves state and re-renders the current page.
import { loadState, saveState, resetState, addTransaction, deleteTransaction, setBudget, addToGoal, toggleBillPaid, money } from './store.js';
import { renderDashboard, renderTransactions, renderBudgets, renderGoals, renderBills, renderReports } from './views.js';

const ROUTES = {
  '/dashboard': { title: 'Dashboard', render: renderDashboard },
  '/transactions': { title: 'Transactions', render: renderTransactions },
  '/budgets': { title: 'Budgets', render: renderBudgets },
  '/goals': { title: 'Savings goals', render: renderGoals },
  '/bills': { title: 'Bills', render: renderBills },
  '/reports': { title: 'Reports', render: renderReports },
};

const NAV = [
  { path: '/dashboard', label: 'Dashboard', mark: '▦' },
  { path: '/transactions', label: 'Transactions', mark: '⇄' },
  { path: '/budgets', label: 'Budgets', mark: '▤' },
  { path: '/goals', label: 'Goals', mark: '◉' },
  { path: '/bills', label: 'Bills', mark: '▣' },
  { path: '/reports', label: 'Reports', mark: '▮' },
];

let state = loadState();
let filter = { q: '', category: '', type: '' };

function currentRoute() {
  const hash = location.hash.replace(/^#/, '') || '/dashboard';
  return ROUTES[hash] ? hash : '/dashboard';
}

function render() {
  const route = currentRoute();
  const view = ROUTES[route];
  const result = route === '/transactions' ? view.render(state, filter) : view.render(state);
  document.getElementById('view').innerHTML = result.html;
  document.querySelectorAll('.sidenav a, .bottomnav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + route);
    if (a.classList.contains('active')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.title = 'Hearth Ledger — ' + view.title;
  if (result.mount) result.mount();
  window.scrollTo(0, 0);
}

function rerender() {
  render();
}

function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2200);
}

// --- delegated events: every control on every page funnels through here ---
document.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  if (action === 'month' && el.dataset.month) {
    state.month = el.dataset.month;
    saveState(state);
    rerender();
  } else if (action === 'delete-tx') {
    deleteTransaction(state, el.dataset.id);
    rerender();
    toast('Transaction deleted.');
  } else if (action === 'toggle-bill') {
    toggleBillPaid(state, el.dataset.id);
    rerender();
  } else if (action === 'goal-quick') {
    addToGoal(state, el.dataset.goal, Number(el.dataset.amount));
    rerender();
    toast('Added ' + money(Number(el.dataset.amount)) + ' to the goal.');
  } else if (action === 'clear-filters') {
    filter = { q: '', category: '', type: '' };
    rerender();
  } else if (action === 'reset-data') {
    if (window.confirm('Reset everything back to the Maple household example data?')) {
      state = resetState();
      filter = { q: '', category: '', type: '' };
      rerender();
      toast('Example data restored.');
    }
  }
});

document.addEventListener('input', (event) => {
  const el = event.target;
  if (el.id === 'filter-q') {
    filter.q = el.value;
    const pos = el.selectionStart;
    rerender();
    const next = document.getElementById('filter-q');
    if (next) {
      next.focus();
      next.setSelectionRange(pos, pos);
    }
  } else if (el.id === 'filter-cat') {
    filter.category = el.value;
    rerender();
  } else if (el.id === 'filter-type') {
    filter.type = el.value;
    rerender();
  } else if (el.dataset.action === 'set-budget') {
    setBudget(state, el.dataset.category, Number(el.value));
    const label = document.querySelector('[data-budget-value="' + el.dataset.category + '"]');
    if (label) label.textContent = money(Number(el.value));
    // Live-update the card's spent/left line without a full re-render,
    // so the slider keeps its grip while dragging.
    const card = el.closest('.budget-card');
    if (card) {
      const head = card.querySelector('.budget-head span:last-child');
      if (head) {
        const spentText = head.textContent.split(' / ')[0];
        head.textContent = spentText + ' / ' + money(Number(el.value));
      }
    }
  }
});

document.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.id === 'add-tx') {
    const data = new FormData(form);
    const amount = Number(data.get('amount'));
    const type = data.get('type');
    if (!amount || amount <= 0) return;
    addTransaction(state, {
      date: data.get('date') || state.month + '-28',
      merchant: String(data.get('merchant') || 'Untitled').trim(),
      category: type === 'income' ? null : String(data.get('category') || 'personal'),
      type,
      amount: Math.round(amount * 100) / 100,
      note: String(data.get('note') || '').trim(),
    });
    rerender();
    toast('Transaction added — totals updated.');
  } else if (form.classList.contains('goal-form')) {
    const amount = Number(new FormData(form).get('amount'));
    if (!amount || amount <= 0) return;
    addToGoal(state, form.dataset.goal, amount);
    rerender();
    toast('Added ' + money(amount) + ' to the goal.');
  }
});

window.addEventListener('hashchange', render);

// Build the two navs (side on desktop, bottom bar on phones) from one list.
function buildNav() {
  const links = NAV.map(
    (n) => `<a href="#${n.path}"><span class="nav-mark" aria-hidden="true">${n.mark}</span><span>${n.label}</span></a>`,
  ).join('');
  document.getElementById('sidenav').innerHTML = links;
  document.getElementById('bottomnav').innerHTML = links;
}

buildNav();
render();
