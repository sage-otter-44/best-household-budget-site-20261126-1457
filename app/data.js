// Seed data for Hearth Ledger: one household's real-looking November 2026
// budget. All figures are example data shipped with the site; the household
// edits them in the app and every change is saved to localStorage.
export const HOUSEHOLD = {
  name: 'The Maple Household',
  members: 'Maya & Jordan Maple · 2 adults, 2 kids',
  currency: 'USD',
};

export const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#1f4d3a', budget: 1850 },
  { id: 'groceries', name: 'Groceries', color: '#2e7d4f', budget: 720 },
  { id: 'dining', name: 'Dining Out', color: '#c96f3f', budget: 320 },
  { id: 'transport', name: 'Transport', color: '#3f6d8e', budget: 410 },
  { id: 'utilities', name: 'Utilities', color: '#d9a441', budget: 260 },
  { id: 'entertainment', name: 'Entertainment', color: '#8a5fa0', budget: 180 },
  { id: 'kids', name: 'Kids & School', color: '#e07856', budget: 350 },
  { id: 'health', name: 'Health', color: '#4a9a8c', budget: 220 },
  { id: 'personal', name: 'Personal', color: '#7a6a53', budget: 150 },
  { id: 'savings', name: 'Savings', color: '#2e6b4f', budget: 800 },
];

// month key -> transactions. type: 'income' | 'expense'.
// November is the full month; October is kept so the month switcher works.
export const SEED_TRANSACTIONS = {
  '2026-11': [
    { id: 't01', date: '2026-11-01', merchant: 'Maya — salary', category: null, type: 'income', amount: 3900, note: 'Monthly pay' },
    { id: 't02', date: '2026-11-01', merchant: 'Rent — Maple Property Group', category: 'housing', type: 'expense', amount: 1850, note: 'Monthly rent' },
    { id: 't03', date: '2026-11-01', merchant: 'Auto-transfer to savings', category: 'savings', type: 'expense', amount: 800, note: 'Pay-yourself-first' },
    { id: 't04', date: '2026-11-02', merchant: 'GreenMart', category: 'groceries', type: 'expense', amount: 96.40, note: 'Weekly shop' },
    { id: 't05', date: '2026-11-03', merchant: 'Shell fuel', category: 'transport', type: 'expense', amount: 48.20, note: 'Jordan’s car' },
    { id: 't06', date: '2026-11-04', merchant: 'BrightSmile Dental', category: 'health', type: 'expense', amount: 120.00, note: 'Check-up, both kids' },
    { id: 't07', date: '2026-11-05', merchant: 'Panda Garden', category: 'dining', type: 'expense', amount: 38.50, note: 'Takeout Thursday' },
    { id: 't08', date: '2026-11-06', merchant: 'City Power', category: 'utilities', type: 'expense', amount: 132.10, note: 'Electric bill' },
    { id: 't09', date: '2026-11-07', merchant: 'Corner Bookshop', category: 'personal', type: 'expense', amount: 54.99, note: 'Maya’s books' },
    { id: 't10', date: '2026-11-08', merchant: 'GreenMart', category: 'groceries', type: 'expense', amount: 112.75, note: 'Weekly shop' },
    { id: 't11', date: '2026-11-09', merchant: 'Cineplex', category: 'entertainment', type: 'expense', amount: 42.00, note: 'Family movie night' },
    { id: 't12', date: '2026-11-10', merchant: 'Metro Transit', category: 'transport', type: 'expense', amount: 65.00, note: 'Monthly bus pass' },
    { id: 't13', date: '2026-11-11', merchant: 'Youth Soccer Club', category: 'kids', type: 'expense', amount: 85.00, note: 'Winter season fees' },
    { id: 't14', date: '2026-11-12', merchant: 'GreenMart', category: 'groceries', type: 'expense', amount: 88.30, note: 'Weekly shop' },
    { id: 't15', date: '2026-11-13', merchant: 'Corner Cafe', category: 'dining', type: 'expense', amount: 24.60, note: 'Lunch with a friend' },
    { id: 't16', date: '2026-11-14', merchant: 'Pharmacy Plus', category: 'health', type: 'expense', amount: 36.40, note: 'Cold medicine' },
    { id: 't17', date: '2026-11-15', merchant: 'Jordan — salary', category: null, type: 'income', amount: 2750, note: 'Monthly pay' },
    { id: 't18', date: '2026-11-15', merchant: 'NorthLink Internet', category: 'utilities', type: 'expense', amount: 79.00, note: 'Internet bill' },
    { id: 't19', date: '2026-11-16', merchant: 'Shell fuel', category: 'transport', type: 'expense', amount: 52.10, note: 'Maya’s car' },
    { id: 't20', date: '2026-11-17', merchant: 'GreenMart', category: 'groceries', type: 'expense', amount: 104.55, note: 'Weekly shop' },
    { id: 't21', date: '2026-11-18', merchant: 'School Book Fair', category: 'kids', type: 'expense', amount: 47.80, note: 'Books for Leo' },
    { id: 't22', date: '2026-11-19', merchant: 'StreamBox', category: 'entertainment', type: 'expense', amount: 15.99, note: 'Monthly streaming' },
    { id: 't23', date: '2026-11-20', merchant: 'Freelance — logo design', category: null, type: 'income', amount: 200, note: 'Jordan’s side work' },
    { id: 't24', date: '2026-11-20', merchant: 'Panda Garden', category: 'dining', type: 'expense', amount: 44.20, note: 'Takeout Friday' },
    { id: 't25', date: '2026-11-21', merchant: 'City Water', category: 'utilities', type: 'expense', amount: 64.30, note: 'Water bill' },
    { id: 't26', date: '2026-11-22', merchant: 'GreenMart', category: 'groceries', type: 'expense', amount: 97.20, note: 'Weekly shop' },
    { id: 't27', date: '2026-11-23', merchant: 'FitLife Gym', category: 'health', type: 'expense', amount: 45.00, note: 'Monthly membership' },
    { id: 't28', date: '2026-11-24', merchant: 'Shell fuel', category: 'transport', type: 'expense', amount: 46.75, note: 'Jordan’s car' },
    { id: 't29', date: '2026-11-25', merchant: 'Toy Chest', category: 'personal', type: 'expense', amount: 62.00, note: 'Birthday gift for aunt' },
    { id: 't30', date: '2026-11-26', merchant: 'GreenMart', category: 'groceries', type: 'expense', amount: 121.60, note: 'Thanksgiving shop' },
    { id: 't31', date: '2026-11-27', merchant: 'School Lunch', category: 'kids', type: 'expense', amount: 40.00, note: 'Lunch account top-up' },
    { id: 't32', date: '2026-11-28', merchant: 'Pizza Night', category: 'dining', type: 'expense', amount: 52.30, note: 'Saturday pizza' },
  ],
  '2026-10': [
    { id: 'o01', date: '2026-10-01', merchant: 'Maya — salary', category: null, type: 'income', amount: 3900, note: 'Monthly pay' },
    { id: 'o02', date: '2026-10-01', merchant: 'Rent — Maple Property Group', category: 'housing', type: 'expense', amount: 1850, note: 'Monthly rent' },
    { id: 'o03', date: '2026-10-01', merchant: 'Auto-transfer to savings', category: 'savings', type: 'expense', amount: 800, note: 'Pay-yourself-first' },
    { id: 'o04', date: '2026-10-03', merchant: 'GreenMart', category: 'groceries', type: 'expense', amount: 104.20, note: 'Weekly shop' },
    { id: 'o05', date: '2026-10-05', merchant: 'Shell fuel', category: 'transport', type: 'expense', amount: 51.40, note: 'Jordan’s car' },
    { id: 'o06', date: '2026-10-07', merchant: 'City Power', category: 'utilities', type: 'expense', amount: 118.60, note: 'Electric bill' },
    { id: 'o07', date: '2026-10-09', merchant: 'GreenMart', category: 'groceries', type: 'expense', amount: 98.75, note: 'Weekly shop' },
    { id: 'o08', date: '2026-10-11', merchant: 'Panda Garden', category: 'dining', type: 'expense', amount: 41.80, note: 'Takeout' },
    { id: 'o09', date: '2026-10-14', merchant: 'Pharmacy Plus', category: 'health', type: 'expense', amount: 28.90, note: 'Vitamins' },
    { id: 'o10', date: '2026-10-15', merchant: 'Jordan — salary', category: null, type: 'income', amount: 2750, note: 'Monthly pay' },
    { id: 'o11', date: '2026-10-16', merchant: 'GreenMart', category: 'groceries', type: 'expense', amount: 110.30, note: 'Weekly shop' },
    { id: 'o12', date: '2026-10-18', merchant: 'Cineplex', category: 'entertainment', type: 'expense', amount: 38.00, note: 'Movie night' },
    { id: 'o13', date: '2026-10-21', merchant: 'School Supplies', category: 'kids', type: 'expense', amount: 73.50, note: 'Art class kit' },
    { id: 'o14', date: '2026-10-24', merchant: 'GreenMart', category: 'groceries', type: 'expense', amount: 96.10, note: 'Weekly shop' },
    { id: 'o15', date: '2026-10-27', merchant: 'Metro Transit', category: 'transport', type: 'expense', amount: 65.00, note: 'Monthly bus pass' },
    { id: 'o16', date: '2026-10-29', merchant: 'Corner Cafe', category: 'dining', type: 'expense', amount: 31.20, note: 'Coffee & lunch' },
  ],
};

export const SEED_GOALS = [
  { id: 'g1', name: 'Emergency fund', detail: '3 months of essentials, kept in a separate savings account', target: 10000, saved: 6400, color: '#1f4d3a' },
  { id: 'g2', name: 'Family vacation — Lake Tahoe', detail: 'A week by the lake next summer, cabin + gas + food', target: 3500, saved: 1950, color: '#3f6d8e' },
  { id: 'g3', name: 'New car down payment', detail: 'Replace Jordan’s 2012 sedan before next winter', target: 8000, saved: 2300, color: '#c96f3f' },
];

export const SEED_BILLS = [
  { id: 'b1', name: 'Rent — Maple Property Group', amount: 1850, due: '2026-12-01', recurring: 'Monthly', autopay: true, paid: false },
  { id: 'b2', name: 'Electric — City Power', amount: 132, due: '2026-12-05', recurring: 'Monthly', autopay: false, paid: false },
  { id: 'b3', name: 'Internet — NorthLink', amount: 79, due: '2026-12-08', recurring: 'Monthly', autopay: true, paid: false },
  { id: 'b4', name: 'Water — City Water', amount: 64, due: '2026-12-12', recurring: 'Monthly', autopay: false, paid: false },
  { id: 'b5', name: 'Car insurance — SafeDrive', amount: 148, due: '2026-12-15', recurring: 'Monthly', autopay: true, paid: false },
  { id: 'b6', name: 'Phone — MobileOne', amount: 96, due: '2026-12-18', recurring: 'Monthly', autopay: false, paid: false },
  { id: 'b7', name: 'Gym — FitLife', amount: 45, due: '2026-12-20', recurring: 'Monthly', autopay: false, paid: false },
];

// Monthly trend used by Reports (Jul–Nov 2026). November matches the
// transaction list above; earlier months are the household's own history.
export const MONTHLY_TREND = [
  { month: 'Jul 2026', income: 6700, spent: 4120 },
  { month: 'Aug 2026', income: 6850, spent: 4380 },
  { month: 'Sep 2026', income: 6700, spent: 3980 },
  { month: 'Oct 2026', income: 6650, spent: 4210 },
  { month: 'Nov 2026', income: 6850, spent: 3667 },
];

export const MONTHS = [
  { key: '2026-10', label: 'October 2026' },
  { key: '2026-11', label: 'November 2026' },
];
