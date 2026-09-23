const fs = require('fs');
const vm = require('vm');

const appCode = fs.readFileSync('./app.js', 'utf8').replace(/\s*init\(\);\s*$/, '');

function makeElement() {
  return {
    value: '',
    textContent: '',
    innerHTML: '',
    classList: { toggle() {}, add() {}, remove() {} },
    setAttribute() {},
    querySelector() { return makeElement(); },
    querySelectorAll() { return []; },
    addEventListener() {},
    getBoundingClientRect() { return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }; },
    dataset: {},
    closest() { return null; },
    style: {},
    reset() {},
    focus() {},
    className: ''
  };
}

const elements = new Map();
const byId = (id) => {
  if (!elements.has(id)) elements.set(id, makeElement());
  return elements.get(id);
};

const document = {
  body: { setAttribute() {}, classList: { toggle() {}, add() {}, remove() {} } },
  querySelectorAll() { return []; },
  getElementById: byId,
  querySelector() { return makeElement(); },
  createElement() { return makeElement(); }
};

const localStorage = {
  store: {},
  getItem(key) { return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null; },
  setItem(key, value) { this.store[key] = String(value); }
};

const context = {
  console,
  document,
  localStorage,
  window: { innerWidth: 1400, innerHeight: 900, confirm: () => true },
  Intl,
  Date,
  Math,
  Number,
  String,
  Array,
  Object,
  setInterval() {},
  clearInterval() {},
  Map,
  Set
};
context.globalThis = context;
vm.createContext(context);
vm.runInContext(appCode, context);

const now = new Date();
const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
const currentDate = new Date(now.getFullYear(), now.getMonth(), 10);
const currentDateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 5);
const prevDateKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}`;

vm.runInContext(`
  appState = {
    settings: {
      teacherName: 'Vanessa',
      dashboardTitle: "Vanessa's Dashboard",
      quote: 'Test quote',
      defaultCurrency: 'PHP',
      phpRate: 58.8,
      exchangeRates: { PHP: 1, USD: 58.8, EUR: 63.6, SGD: 43, AED: 12.5 },
      theme: 'soft',
      font: 'serif',
      teacherTimezone: 'Asia/Manila',
      reminderSettings: 'Reminder'
    },
    students: [
      { id: 's1', name: 'Alice', country: 'Philippines', company: 'Test Co', currency: 'PHP', status: 'Active', rate25: 300, rate50: 500 },
      { id: 's2', name: 'Bob', country: 'Singapore', company: 'SG Co', currency: 'SGD', status: 'Active', rate25: 20, rate50: 35 }
    ],
    classes: [
      { id: 'live-class', studentId: 's1', date: '${currentDateKey}', startTime: '09:00', duration: 60, attendance: 'Present', classType: 'Regular' },
      { id: 'old-class', studentId: 's1', date: '${prevDateKey}', startTime: '09:00', duration: 60, attendance: 'Present', classType: 'Regular' }
    ],
    payments: [
      { id: 'p1', studentId: 's1', studentName: 'Alice', currency: 'PHP', subtotal: 500, classDate: '${currentDateKey}', status: 'Paid' },
      { id: 'p2', studentId: 's1', studentName: 'Alice', currency: 'PHP', subtotal: 250, classDate: '${prevDateKey}', status: 'Paid' }
    ],
    quotes: [],
    schedules: [],
    companies: ['Test Co']
  };
  refs.recordSearch.value = '';
  refs.recordStatusFilter.value = 'all';
  refs.reportMonthInput.value = '';
  renderDashboard();
  renderClassRecords();
  renderReports();
`, context);

const recordsHtml = String(vm.runInContext('refs.recordsTableBody.innerHTML', context));
if (!/live-class/.test(recordsHtml) || /old-class/.test(recordsHtml)) {
  throw new Error('Class records should only display the current live month');
}

if (String(vm.runInContext('refs.reportMonthInput.value', context)) !== currentMonthKey) {
  throw new Error('Reports should automatically follow the current live month');
}

if (vm.runInContext('typeof updateSelectedExchangeRateInput', context) !== 'function') {
  throw new Error('Manual exchange rate sync helper is missing');
}

vm.runInContext(`
  refs.exchangeRateCurrencyInput.value = 'AED';
  appState.settings.exchangeRates.AED = 12.5;
  updateSelectedExchangeRateInput();
`, context);
if (String(vm.runInContext('refs.exchangeRateValueInput.value', context)) !== '12.5') {
  throw new Error('Selecting a currency should update the manual rate field to that currency value');
}

vm.runInContext(`
  appState.settings.milestoneReminders = [{ studentId: 's1', threshold: 2 }];
  appState.classes.push({ id: 'reminder-class-1', studentId: 's1', date: '${currentDateKey}', startTime: '10:00', duration: 50, attendance: 'Present', classType: 'Regular' });
  appState.classes.push({ id: 'reminder-class-2', studentId: 's1', date: '${currentDateKey}', startTime: '11:00', duration: 50, attendance: 'Present', classType: 'Regular' });
  renderDashboard();
`, context);

const reminderHtml = String(vm.runInContext('refs.dashboardReminderBanner.innerHTML', context));
if (!/Alice/.test(reminderHtml) || !/2/.test(reminderHtml)) {
  throw new Error('Dashboard reminder banner should appear for milestone-reached students');
}

console.log('rate totals test passed');
