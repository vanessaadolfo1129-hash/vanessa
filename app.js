const STORAGE_KEY = 'teacher_vanessa_dashboard_state_v1';
const COUNTRY_TIMEZONE_MAP = {
  'Afghanistan': 'Asia/Kabul',
  'Australia': 'Australia/Sydney',
  'Austria': 'Europe/Vienna',
  'Bahrain': 'Asia/Bahrain',
  'Bangladesh': 'Asia/Dhaka',
  'Belgium': 'Europe/Brussels',
  'Brazil': 'America/Sao_Paulo',
  'Canada': 'America/Toronto',
  'China': 'Asia/Shanghai',
  'Denmark': 'Europe/Copenhagen',
  'Egypt': 'Africa/Cairo',
  'France': 'Europe/Paris',
  'Germany': 'Europe/Berlin',
  'Greece': 'Europe/Athens',
  'Hong Kong': 'Asia/Hong_Kong',
  'India': 'Asia/Kolkata',
  'Indonesia': 'Asia/Jakarta',
  'Ireland': 'Europe/Dublin',
  'Italy': 'Europe/Rome',
  'Japan': 'Asia/Tokyo',
  'Malaysia': 'Asia/Kuala_Lumpur',
  'Mexico': 'America/Mexico_City',
  'Netherlands': 'Europe/Amsterdam',
  'New Zealand': 'Pacific/Auckland',
  'Pakistan': 'Asia/Karachi',
  'Philippines': 'Asia/Manila',
  'Portugal': 'Europe/Lisbon',
  'Saudi Arabia': 'Asia/Riyadh',
  'Singapore': 'Asia/Singapore',
  'South Korea': 'Asia/Seoul',
  'Spain': 'Europe/Madrid',
  'Sweden': 'Europe/Stockholm',
  'Switzerland': 'Europe/Zurich',
  'Taiwan': 'Asia/Taipei',
  'Thailand': 'Asia/Bangkok',
  'Turkey': 'Europe/Istanbul',
  'United Arab Emirates': 'Asia/Dubai',
  'United Kingdom': 'Europe/London',
  'United States': 'America/New_York',
  'Vietnam': 'Asia/Ho_Chi_Minh',
  'South Africa': 'Africa/Johannesburg',
  'Argentina': 'America/Argentina/Buenos_Aires',
  'Ukraine': 'Europe/Kyiv',
  'Romania': 'Europe/Bucharest',
  'Poland': 'Europe/Warsaw',
  'Norway': 'Europe/Oslo',
  'Finland': 'Europe/Helsinki',
  'Czech Republic': 'Europe/Prague',
  'Israel': 'Asia/Jerusalem',
  'UAE': 'Asia/Dubai',
  'Qatar': 'Asia/Qatar'
};

const COUNTRY_OPTIONS = Object.keys(COUNTRY_TIMEZONE_MAP).sort();
const CURRENCY_OPTIONS = ['PHP', 'USD', 'EUR', 'SGD', 'AUD', 'GBP', 'JPY', 'CAD', 'CHF', 'HKD', 'NZD', 'CNY', 'KRW', 'AED', 'THB', 'IDR', 'MYR', 'INR', 'SEK', 'NOK', 'DKK', 'SAR'];
const CURRENCY_LABELS = {
  PHP: 'Philippine Peso',
  USD: 'US Dollar',
  EUR: 'Euro',
  SGD: 'Singapore Dollar',
  AUD: 'Australian Dollar',
  GBP: 'British Pound Sterling',
  JPY: 'Japanese Yen',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  HKD: 'Hong Kong Dollar',
  NZD: 'New Zealand Dollar',
  CNY: 'Chinese Yuan',
  KRW: 'South Korean Won',
  AED: 'United Arab Emirates Dirham',
  THB: 'Thai Baht',
  IDR: 'Indonesian Rupiah',
  MYR: 'Malaysian Ringgit',
  INR: 'Indian Rupee',
  SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone',
  DKK: 'Danish Krone',
  SAR: 'Saudi Riyal'
};
const DEFAULT_SETTINGS = {
  teacherName: 'Vanessa',
  dashboardTitle: "Vanessa's Dashboard",
  quote: 'Add an encouraging quote for your dashboard.',
  defaultCurrency: 'PHP',
  phpRate: 58.8,
  milestoneReminders: [],
  exchangeRates: {
    PHP: 1,
    USD: 58.8,
    EUR: 63.6,
    SGD: 42.8,
    AUD: 43.1
  },
  theme: 'soft',
  font: 'serif',
  profileImage: '',
  teacherTimezone: 'Asia/Manila',
  reminderSettings: 'Send a gentle reminder 24 hours before each class.'
};

const STORAGE_VERSION = 1;

let appState = loadState();
let activeView = 'dashboard';
let currentScheduleWeek = getStartOfWeek(new Date());
let classModalEditingId = null;
let studentModalEditingId = null;

const refs = {
  navButtons: document.querySelectorAll('.nav-item'),
  views: document.querySelectorAll('.view'),
  currentTime: document.getElementById('currentTime'),
  currentDate: document.getElementById('currentDate'),
  profileAvatar: document.getElementById('profileAvatar'),
  profileImageInput: document.getElementById('profileImageInput'),
  profileImageClearBtn: document.getElementById('profileImageClearBtn'),
  profileImagePreview: document.getElementById('profileImagePreview'),
  welcomeGreeting: document.getElementById('welcomeGreeting'),
  teacherSubtitle: document.getElementById('teacherSubtitle'),
  dashboardTitle: document.getElementById('dashboardTitle'),
  dashboardQuoteInput: document.getElementById('dashboardQuoteInput'),
  saveQuoteBtn: document.getElementById('saveQuoteBtn'),
  dashboardReminderBanner: document.getElementById('dashboardReminderBanner'),
  studentsTableBody: document.getElementById('studentsTableBody'),
  studentSearch: document.getElementById('studentSearch'),
  studentCountryFilter: document.getElementById('studentCountryFilter'),
  studentStatusFilter: document.getElementById('studentStatusFilter'),
  studentCompanyFilter: document.getElementById('studentCompanyFilter'),
  addStudentBtn: document.getElementById('addStudentBtn'),
  addCompanyBtn: document.getElementById('addCompanyBtn'),
  companyFilterBtn: document.getElementById('companyFilterBtn'),
  companyList: document.getElementById('companyList'),
  companyModal: document.getElementById('companyModal'),
  companyForm: document.getElementById('companyForm'),
  studentModal: document.getElementById('studentModal'),
  studentModalTitle: document.getElementById('studentModalTitle'),
  studentForm: document.getElementById('studentForm'),
  classModal: document.getElementById('classModal'),
  classModalTitle: document.getElementById('classModalTitle'),
  classForm: document.getElementById('classForm'),
  classStudentSelect: document.getElementById('classStudentSelect'),
  classFormWarning: document.getElementById('classFormWarning'),
  scheduleGrid: document.getElementById('scheduleGrid'),
  scheduleWeekLabel: document.getElementById('scheduleWeekLabel'),
  schedulePrevBtn: document.getElementById('schedulePrevBtn'),
  scheduleTodayBtn: document.getElementById('scheduleTodayBtn'),
  scheduleNextBtn: document.getElementById('scheduleNextBtn'),
  addClassBtn: document.getElementById('addClassBtn'),
  paymentsList: document.getElementById('paymentsList'),
  paymentStatusFilter: document.getElementById('paymentStatusFilter'),
  paymentStudentFilter: document.getElementById('paymentStudentFilter'),
  paymentFromDate: document.getElementById('paymentFromDate'),
  paymentToDate: document.getElementById('paymentToDate'),
  paymentBreakdown: document.getElementById('paymentBreakdown'),
  paymentTotalsStrip: document.getElementById('paymentTotalsStrip'),
  recordsTableBody: document.getElementById('recordsTableBody'),
  recordSearch: document.getElementById('recordSearch'),
  recordMonthInput: document.getElementById('recordMonthInput'),
  recordStatusFilter: document.getElementById('recordStatusFilter'),
  addRecordBtn: document.getElementById('addRecordBtn'),
  reportMonthInput: document.getElementById('reportMonthInput'),
  reportPaidValue: document.getElementById('reportPaidValue'),
  reportPendingValue: document.getElementById('reportPendingValue'),
  reportTotalValue: document.getElementById('reportTotalValue'),
  reportCancelledValue: document.getElementById('reportCancelledValue'),
  reportMinutesValue: document.getElementById('reportMinutesValue'),
  attendanceBars: document.getElementById('attendanceBars'),
  revenueByStudent: document.getElementById('revenueByStudent'),
  monthTotalStatValue: document.getElementById('monthTotalStatValue'),
  exchangeRateCurrencyInput: document.getElementById('exchangeRateCurrencyInput'),
  exchangeRateValueInput: document.getElementById('exchangeRateValueInput'),
  saveExchangeRateBtn: document.getElementById('saveExchangeRateBtn'),
  exchangeRateList: document.getElementById('exchangeRateList'),
  settingsForm: document.getElementById('settingsForm'),
  teacherNameInput: document.getElementById('teacherNameInput'),
  dashboardTitleInput: document.getElementById('dashboardTitleInput'),
  settingsQuoteInput: document.getElementById('settingsQuoteInput'),
  defaultCurrencyInput: document.getElementById('defaultCurrencyInput'),
  phpRateInput: document.getElementById('phpRateInput'),
  themeInput: document.getElementById('themeInput'),
  fontInput: document.getElementById('fontInput'),
  timezoneInput: document.getElementById('timezoneInput'),
  reminderSettingsInput: document.getElementById('reminderSettingsInput'),
  milestoneStudentSelect: document.getElementById('milestoneStudentSelect'),
  milestoneThresholdSelect: document.getElementById('milestoneThresholdSelect'),
  addMilestoneReminderBtn: document.getElementById('addMilestoneReminderBtn'),
  milestoneReminderList: document.getElementById('milestoneReminderList')
};

function init() {
  ensureDemoData();
  appState = loadState();
  reconcilePaymentRecords({ preserveHistoricalRate: true });
  populateStaticFilters();
  bindEvents();
  applyTheme(appState.settings.theme);
  applyFont(appState.settings.font);
  setCurrentView('dashboard');
  updateHeaderTime();
  setInterval(updateHeaderTime, 1000);
  renderAll();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultState();
    }

    const parsed = JSON.parse(raw);
    const studentCompanies = Array.isArray(parsed.students)
      ? parsed.students.map((student) => student.company).filter(Boolean)
      : [];

    return {
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      students: Array.isArray(parsed.students) ? parsed.students : [],
      classes: Array.isArray(parsed.classes) ? parsed.classes : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : [],
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes : [],
      schedules: Array.isArray(parsed.schedules) ? parsed.schedules : [],
      companies: Array.isArray(parsed.companies)
        ? parsed.companies
        : [...new Set(studentCompanies)]
    };
  } catch (error) {
    console.warn('Could not parse saved dashboard state:', error);
    return createDefaultState();
  }
}

function createDefaultState() {
  return {
    settings: { ...DEFAULT_SETTINGS },
    students: [],
    classes: [],
    payments: [],
    quotes: [],
    schedules: [],
    companies: []
  };
}

function ensureDemoData() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    return;
  }

  const baseState = buildDemoState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(baseState));
}

function buildDemoState() {
  const now = new Date();
  const monday = getStartOfWeek(now);
  const today = stripTime(new Date());

  const studentA = {
    id: generateId('student'),
    name: 'Anna Cruz',
    age: 19,
    company: 'Horizon Kids',
    country: 'Philippines',
    timezone: 'Asia/Manila',
    currency: 'PHP',
    paymentType: 'Weekly',
    bookMaterial: 'Reading Guide',
    startDate: formatDateInput(addDays(today, -32)),
    status: 'Active',
    rate25: 320,
    rate50: 560,
    notes: 'Warm and attentive student.'
  };

  const studentB = {
    id: generateId('student'),
    name: 'Li Wei',
    age: 29,
    company: 'Acme Language Co.',
    country: 'Singapore',
    timezone: 'Asia/Singapore',
    currency: 'SGD',
    paymentType: 'Weekly',
    bookMaterial: 'Business Words',
    startDate: formatDateInput(addDays(today, -45)),
    status: 'Active',
    rate25: 75,
    rate50: 130,
    notes: 'Prefers evening classes.'
  };

  const classes = [
    {
      id: generateId('class'),
      studentId: studentA.id,
      date: formatDateInput(addDays(monday, 0)),
      startTime: '08:00',
      duration: 50,
      classType: 'Regular',
      attendance: 'Present',
      notes: 'Conversation practice'
    },
    {
      id: generateId('class'),
      studentId: studentA.id,
      date: formatDateInput(addDays(monday, 2)),
      startTime: '09:30',
      duration: 25,
      classType: 'Regular',
      attendance: 'Absent',
      notes: 'Student called in sick'
    },
    {
      id: generateId('class'),
      studentId: studentB.id,
      date: formatDateInput(addDays(monday, 4)),
      startTime: '18:30',
      duration: 60,
      classType: 'Regular',
      attendance: 'Present',
      notes: 'Business English'
    },
    {
      id: generateId('class'),
      studentId: studentA.id,
      date: formatDateInput(today),
      startTime: '07:30',
      duration: 25,
      classType: 'Regular',
      attendance: 'Scheduled',
      notes: 'Vocabulary review'
    },
    {
      id: generateId('class'),
      studentId: studentB.id,
      date: formatDateInput(addDays(today, -1)),
      startTime: '09:00',
      duration: 50,
      classType: 'Trial',
      attendance: 'Cancelled',
      notes: 'Trial session cancelled by student'
    }
  ];

  const settings = { ...DEFAULT_SETTINGS, teacherName: 'Vanessa', dashboardTitle: "Vanessa's Dashboard" };

  const payments = createDemoPayments(classes, [studentA, studentB], settings);
  const companies = ['Horizon Kids', 'Acme Language Co.'];

  return {
    settings,
    students: [studentA, studentB],
    classes,
    payments,
    quotes: ['Keep showing up, one lesson at a time.'],
    schedules: [],
    companies
  };
}

function createDemoPayments(classList, students, settings) {
  return classList
    .map((item) => {
      const student = students.find((entry) => entry.id === item.studentId);
      if (!student) return null;
      const payable = isClassPayable(item, student);
      if (!payable) return null;
      const rate = getRateForClass(student, item.duration);
      const exchangeRate = getExchangeRate(student.currency || settings.defaultCurrency);
      const amount = roundMoney(parseFloat(rate));
      const status = item.attendance === 'Present' ? 'Paid' : 'Pending';
      return {
        id: generateId('payment'),
        classId: item.id,
        studentId: student.id,
        studentName: student.name,
        company: student.company,
        currency: student.currency || settings.defaultCurrency,
        classes: 1,
        classDate: item.date,
        duration: item.duration,
        attendance: item.attendance,
        rate,
        subtotal: amount,
        status,
        weekStart: getWeekStartISO(item.date),
        appliedRate: rate,
        appliedExchangeRate: exchangeRate,
        finalPhpAmount: roundMoney(amount * exchangeRate)
      };
    })
    .filter(Boolean);
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function bindEvents() {
  refs.navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setCurrentView(button.dataset.view);
    });
  });

  refs.saveQuoteBtn.addEventListener('click', () => {
    const nextQuote = refs.dashboardQuoteInput.value.trim();
    if (!nextQuote) {
      refs.dashboardQuoteInput.value = appState.settings.quote;
      return;
    }

    appState.settings.quote = nextQuote;
    persistState();
    renderAll();
  });

  refs.addStudentBtn.addEventListener('click', () => openStudentModal());
  refs.addCompanyBtn.addEventListener('click', () => openCompanyModal());
  refs.companyFilterBtn.addEventListener('click', () => {
    refs.studentCompanyFilter.value = 'all';
    refs.studentCountryFilter.value = 'all';
    renderStudents();
  });

  refs.companyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const companyName = String(new FormData(refs.companyForm).get('companyName') || '').trim();
    if (!companyName) {
      return;
    }

    addCompany(companyName);
    refs.studentCompanyFilter.value = companyName;
    closeModal(refs.companyModal);
    renderAll();
  });

  refs.studentSearch.addEventListener('input', renderStudents);
  refs.studentCountryFilter.addEventListener('change', renderStudents);
    refs.studentStatusFilter.addEventListener('change', renderStudents);
  refs.studentForm.querySelector('[name="country"]').addEventListener('change', (event) => {
    const country = event.target.value;
    const timezone = COUNTRY_TIMEZONE_MAP[country] || 'UTC';
    refs.studentForm.querySelector('[name="timezone"]').value = timezone;
  });

  refs.studentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(refs.studentForm);
    const payload = {
      id: studentModalEditingId || generateId('student'),
      name: String(formData.get('name') || '').trim(),
      age: Number(formData.get('age') || 0),
      company: String(formData.get('company') || '').trim(),
      country: String(formData.get('country') || '').trim(),
      timezone: String(formData.get('timezone') || '').trim() || 'UTC',
      currency: String(formData.get('currency') || appState.settings.defaultCurrency),
      paymentType: String(formData.get('paymentType') || 'Weekly'),
      bookMaterial: String(formData.get('bookMaterial') || '').trim(),
      startDate: String(formData.get('startDate') || ''),
      status: String(formData.get('status') || 'Active'),
      rate25: Number(formData.get('rate25') || 0),
      rate50: Number(formData.get('rate50') || 0),
      notes: String(formData.get('notes') || '').trim()
    };

    if (!payload.name || !payload.company) {
      return;
    }

    if (studentModalEditingId) {
      appState.students = appState.students.map((student) =>
        student.id === studentModalEditingId ? { ...student, ...payload } : student
      );
      appState.payments = appState.payments.map((payment) =>
        payment.studentId === studentModalEditingId
          ? {
              ...payment,
              studentName: payload.name,
              company: payload.company,
              currency: payload.currency
            }
          : payment
      );
    } else {
      appState.students.push(payload);
    }

    reconcilePaymentRecords({ preserveHistoricalRate: false });
    persistState();
    closeModal(refs.studentModal);
    renderAll();
  });

  refs.classForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(refs.classForm);
    const studentId = formData.get('studentId');
    const baseDate = String(formData.get('date') || '');
    const startTime = String(formData.get('startTime') || '');
    const duration = Number(formData.get('duration') || 0);
    const classType = String(formData.get('classType') || 'Regular');
    const repeatCount = Math.max(0, Number(formData.get('repeatCount') || 0));
    const notes = String(formData.get('notes') || '').trim();

    if (!studentId || !baseDate || !startTime || !duration) {
      return;
    }

    const candidateDates = [];
    for (let offset = 0; offset <= repeatCount; offset += 1) {
      candidateDates.push(formatDateInput(addDays(new Date(`${baseDate}T00:00:00`), offset)));
    }

    const nextClasses = candidateDates.map((date, index) => ({
      id: classModalEditingId && index === 0 ? classModalEditingId : generateId('class'),
      studentId,
      date,
      startTime,
      duration,
      classType,
      attendance: 'Scheduled',
      notes
    }));

    const hasOverlap = nextClasses.some((entry) => detectOverlap({
      id: entry.id,
      studentId: entry.studentId,
      date: entry.date,
      startTime: entry.startTime,
      duration: entry.duration
    }));

    if (hasOverlap) {
      refs.classFormWarning.textContent = 'Warning: one or more of these class slots overlaps an existing schedule and has not been saved.';
      refs.classFormWarning.classList.remove('hidden');
      return;
    }

    if (classModalEditingId) {
      appState.classes = appState.classes.map((item) => item.id === classModalEditingId ? nextClasses[0] : item);
    } else {
      appState.classes.push(...nextClasses);
    }

    reconcilePaymentRecords({ preserveHistoricalRate: false });
    persistState();
    closeModal(refs.classModal);
    renderAll();
  });

  refs.paymentStatusFilter.addEventListener('change', renderPayments);
  refs.paymentStudentFilter.addEventListener('change', renderPayments);
  refs.paymentFromDate.addEventListener('change', renderPayments);
  refs.paymentToDate.addEventListener('change', renderPayments);

  refs.recordSearch.addEventListener('input', renderClassRecords);
  if (refs.recordMonthInput) {
    refs.recordMonthInput.addEventListener('change', renderClassRecords);
  }
  refs.recordStatusFilter.addEventListener('change', renderClassRecords);
  refs.addRecordBtn.addEventListener('click', () => openClassModal());

  refs.reportMonthInput.addEventListener('change', renderReports);
  if (refs.exchangeRateCurrencyInput) {
    refs.exchangeRateCurrencyInput.addEventListener('change', () => {
      renderExchangeRates();
      updateSelectedExchangeRateInput();
    });
  }
  if (refs.exchangeRateValueInput) {
    refs.exchangeRateValueInput.addEventListener('input', () => {
      // Keep the user's manual typing until they explicitly save.
      // We do not re-render while they are editing to avoid losing characters.
    });
  }
  if (refs.saveExchangeRateBtn) {
    refs.saveExchangeRateBtn.addEventListener('click', () => {
      const currency = refs.exchangeRateCurrencyInput.value || 'PHP';
      const rawValue = String(refs.exchangeRateValueInput.value || '').trim();
      const sanitizedValue = rawValue
        .replace(/,/g, '.')
        .replace(/[^0-9.]/g, '')
        .replace(/\.(?=.*\.)/g, '');
      const parsedValue = sanitizedValue === '' ? Number(appState.settings.exchangeRates[currency] || getExchangeRate(currency) || 1) : Number(sanitizedValue);
      const nextRate = Number.isFinite(parsedValue) ? parsedValue : Number(appState.settings.exchangeRates[currency] || getExchangeRate(currency) || 1);
      appState.settings.exchangeRates[currency] = nextRate;
      refs.exchangeRateValueInput.value = String(nextRate);
      persistState();
      reconcilePaymentRecords({ preserveHistoricalRate: false });
      renderAll();
    });
  }

  document.querySelectorAll('.exchange-rate-input').forEach((input) => {
    input.addEventListener('change', (event) => {
      const currency = event.target.dataset.exchangeCurrency;
      if (!currency) return;
      appState.settings.exchangeRates[currency] = Number(event.target.value || 1);
      persistState();
      reconcilePaymentRecords({ preserveHistoricalRate: false });
      renderAll();
    });
  });

  if (refs.addMilestoneReminderBtn) {
    refs.addMilestoneReminderBtn.addEventListener('click', addMilestoneReminder);
  }

  if (refs.profileImageInput) {
    refs.profileImageInput.addEventListener('change', handleProfileImageUpload);
  }

  if (refs.profileImageClearBtn) {
    refs.profileImageClearBtn.addEventListener('click', () => {
      appState.settings.profileImage = '';
      persistState();
      renderHeader();
      renderSettings();
      if (refs.profileImageInput) {
        refs.profileImageInput.value = '';
      }
    });
  }

  refs.settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    appState.settings.teacherName = refs.teacherNameInput.value.trim() || DEFAULT_SETTINGS.teacherName;
    appState.settings.dashboardTitle = refs.dashboardTitleInput.value.trim() || DEFAULT_SETTINGS.dashboardTitle;
    appState.settings.quote = refs.settingsQuoteInput.value.trim() || DEFAULT_SETTINGS.quote;
    appState.settings.defaultCurrency = refs.defaultCurrencyInput.value;
    appState.settings.phpRate = Number(refs.phpRateInput.value || DEFAULT_SETTINGS.phpRate);
    appState.settings.exchangeRates = { ...DEFAULT_SETTINGS.exchangeRates };

    appState.settings.theme = refs.themeInput.value;
    appState.settings.font = refs.fontInput.value;
    appState.settings.teacherTimezone = refs.timezoneInput.value.trim() || DEFAULT_SETTINGS.teacherTimezone;
    appState.settings.reminderSettings = refs.reminderSettingsInput.value.trim() || DEFAULT_SETTINGS.reminderSettings;

    applyTheme(appState.settings.theme);
    applyFont(appState.settings.font);
    reconcilePaymentRecords({ preserveHistoricalRate: false });
    persistState();
    renderAll();
  });

  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.close;
      const modal = document.getElementById(target);
      if (modal) closeModal(modal);
    });
  });

  refs.schedulePrevBtn.addEventListener('click', () => {
    currentScheduleWeek = addDays(currentScheduleWeek, -7);
    renderSchedule();
  });

  refs.scheduleNextBtn.addEventListener('click', () => {
    currentScheduleWeek = addDays(currentScheduleWeek, 7);
    renderSchedule();
  });

  refs.scheduleTodayBtn.addEventListener('click', () => {
    currentScheduleWeek = getStartOfWeek(new Date());
    renderSchedule();
  });

  refs.addClassBtn.addEventListener('click', () => openClassModal());

  document.getElementById('companyModal').addEventListener('click', (event) => {
    if (event.target === refs.companyModal) closeModal(refs.companyModal);
  });

  document.getElementById('studentModal').addEventListener('click', (event) => {
    if (event.target === refs.studentModal) closeModal(refs.studentModal);
  });

  document.getElementById('classModal').addEventListener('click', (event) => {
    if (event.target === refs.classModal) closeModal(refs.classModal);
  });
}

function setCurrentView(viewName) {
  activeView = viewName;
  refs.navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.view === viewName);
  });

  refs.views.forEach((view) => {
    view.classList.toggle('active', view.id === `${viewName}-view`);
  });
}

function getCurrentMonthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function syncLiveMonthSelection() {
  if (!refs.reportMonthInput) {
    return;
  }

  const liveMonth = getCurrentMonthKey();
  if (!refs.reportMonthInput.value || refs.reportMonthInput.value !== liveMonth) {
    refs.reportMonthInput.value = liveMonth;
  }
}

function renderAll() {
  renderHeader();
  populateStudentFormLookups();
  renderDashboard();
  renderStudents();
  renderSchedule();
  renderPayments();
  renderClassRecords();
  renderReports();
  renderSettings();
  populateStaticFilters();
}

function renderHeader() {
  const teacherName = appState.settings.teacherName || DEFAULT_SETTINGS.teacherName;
  const daytime = getGreeting(new Date());
  refs.welcomeGreeting.textContent = `${daytime} ${teacherName}`;
  refs.teacherSubtitle.textContent = `${teacherName} · Private Class Teacher`;
  refs.dashboardTitle.textContent = appState.settings.dashboardTitle || "Vanessa's Dashboard";
  refs.dashboardQuoteInput.value = appState.settings.quote || DEFAULT_SETTINGS.quote;
  applyProfileImage();
}

function getStudentMonthlyClassCount(studentId, monthKey = getCurrentMonthKey()) {
  return appState.classes.filter((classItem) => {
    if (classItem.studentId !== studentId || !classItem.date || !classItem.date.startsWith(monthKey)) {
      return false;
    }
    return classItem.attendance !== 'Cancelled';
  }).length;
}

function addMilestoneReminder() {
  const selectedStudents = Array.from(document.querySelectorAll('input[name="milestoneStudentCheckbox"]:checked'))
    .map((input) => String(input.value || '').trim())
    .filter(Boolean);
  const selectedThresholds = Array.from(document.querySelectorAll('input[name="milestoneThresholdCheckbox"]:checked'))
    .map((input) => Number(input.value))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!selectedStudents.length || !selectedThresholds.length) {
    return;
  }

  appState.settings.milestoneReminders = Array.isArray(appState.settings.milestoneReminders)
    ? appState.settings.milestoneReminders
    : [];

  const existing = new Set(appState.settings.milestoneReminders.map((entry) => `${entry.studentId}:${Number(entry.threshold)}`));

  selectedStudents.forEach((studentId) => {
    selectedThresholds.forEach((threshold) => {
      const key = `${studentId}:${threshold}`;
      if (!existing.has(key)) {
        appState.settings.milestoneReminders.push({ studentId, threshold });
        existing.add(key);
      }
    });
  });

  persistState();
  renderSettings();
  renderDashboard();
}

function removeMilestoneReminder(studentId, threshold) {
  if (!studentId || !Number.isFinite(Number(threshold))) {
    return;
  }

  appState.settings.milestoneReminders = (appState.settings.milestoneReminders || []).filter(
    (entry) => !(entry.studentId === studentId && Number(entry.threshold) === Number(threshold))
  );

  persistState();
  renderSettings();
  renderDashboard();
}

function renderDashboard() {
  const students = appState.students;
  const activeStudents = students.filter((student) => student.status === 'Active').length;
  const pendingPayments = appState.payments.filter((payment) => payment.status === 'Pending').length;
  const paidPayments = appState.payments.filter((payment) => payment.status === 'Paid').length;

  document.getElementById('studentStatCount').textContent = String(students.length);
  document.getElementById('activeStatCount').textContent = String(activeStudents);
  document.getElementById('pendingStatCount').textContent = String(pendingPayments);
  document.getElementById('paidStatCount').textContent = String(paidPayments);

  const today = stripTime(new Date());
  const weekRange = getCurrentWeekRange();
  refs.scheduleWeekLabel.textContent = `Week of ${formatWeekRange(weekRange.monday, weekRange.sunday)}`;
  const weekTotal = appState.payments
    .reduce((sum, payment) => {
      const date = payment.classDate ? new Date(`${payment.classDate}T00:00:00`) : null;
      if (date && date >= weekRange.monday && date <= weekRange.sunday) {
        return sum + convertCurrencyValue(Number(payment.subtotal || payment.amount || 0), payment.currency, appState.settings.defaultCurrency);
      }
      return sum;
    }, 0);

  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const monthTotal = appState.payments.reduce((sum, payment) => {
    const date = payment.classDate ? new Date(`${payment.classDate}T00:00:00`) : null;
    if (date && date >= currentMonthStart && date <= currentMonthEnd) {
      return sum + convertCurrencyValue(Number(payment.subtotal || payment.amount || 0), payment.currency, appState.settings.defaultCurrency);
    }
    return sum;
  }, 0);

  document.getElementById('weekRangeLabel').textContent = formatWeekRange(weekRange.monday, weekRange.sunday);

  const weekTotalLabel = formatCurrencyAmount(weekTotal, appState.settings.defaultCurrency);
  const monthTotalLabel = formatCurrencyAmount(monthTotal, appState.settings.defaultCurrency);
  const summaryRows = [
    { label: 'Current Week', value: weekTotalLabel },
    { label: 'Monthly Total', value: monthTotalLabel },
    { label: 'Classes', value: `${appState.classes.filter((item) => isWithinCurrentWeek(item.date)).length}` },
    { label: 'Pending', value: `${pendingPayments}` },
    { label: 'Paid', value: `${paidPayments}` }
  ];

  document.getElementById('salarySummaryBox').innerHTML = summaryRows
    .map((row) => `
      <div class="salary-row">
        <span>${row.label}</span>
        <strong>${row.value}</strong>
      </div>
    `)
    .join('');

  const recentItems = [...appState.classes]
    .sort((a, b) => new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`))
    .slice(0, 4);

  const recentMarkup = recentItems.length
    ? recentItems
        .map((item) => {
          const student = getStudentById(item.studentId);
          return `
            <div class="list-item">
              <div>
                <div class="name">${student ? student.name : 'Unknown Student'}</div>
                <div class="meta">${formatDisplayDate(item.date)} · ${item.duration} min · ${item.attendance}</div>
              </div>
              <span class="tag">${item.classType}</span>
            </div>
          `;
        })
        .join('')
    : '<div class="empty-state">No recent classes.</div>';

  document.getElementById('recentClassesList').innerHTML = recentMarkup;

  const todayClasses = appState.classes.filter((item) => item.date === formatDateInput(today));
  document.getElementById('todayClassCount').textContent = `${todayClasses.length} scheduled`;
  if (refs.monthTotalStatValue) {
    refs.monthTotalStatValue.textContent = monthTotalLabel;
  }

  const reminderEntries = (appState.settings.milestoneReminders || [])
    .map((entry) => {
      const student = getStudentById(entry.studentId);
      if (!student) {
        return null;
      }

      const count = getStudentMonthlyClassCount(student.id);
      return { ...entry, student, count };
    })
    .filter(Boolean)
    .filter((entry) => entry.count >= Number(entry.threshold));

  if (refs.dashboardReminderBanner) {
    if (!reminderEntries.length) {
      refs.dashboardReminderBanner.innerHTML = '';
      refs.dashboardReminderBanner.classList.add('hidden');
    } else {
      refs.dashboardReminderBanner.classList.remove('hidden');
      refs.dashboardReminderBanner.innerHTML = reminderEntries
        .map((entry) => `
          <div class="dashboard-reminder-item">
            <span class="dashboard-reminder-icon">📣</span>
            <div>
              <strong>${escapeHtml(entry.student.name)}</strong> reached <strong>${entry.threshold}</strong> classes this month
              <small>(${entry.count} completed)</small>
            </div>
          </div>
        `)
        .join('');
    }
  }

  const todayMarkup = todayClasses.length
    ? todayClasses
        .map((item) => {
          const student = getStudentById(item.studentId);
          return `
            <div class="list-item">
              <div>
                <div class="name">${student ? student.name : 'Unknown Student'}</div>
                <div class="meta">${item.startTime} · ${item.duration} min · ${item.classType}</div>
              </div>
              <span class="tag">${item.attendance}</span>
            </div>
          `;
        })
        .join('')
    : '<div class="empty-state">No classes today.</div>';

  document.getElementById('todayClassesList').innerHTML = todayMarkup;
}

function renderStudents() {
  const keyword = refs.studentSearch.value.trim().toLowerCase();
  const countryValue = refs.studentCountryFilter.value;
  const statusValue = refs.studentStatusFilter.value;
  const companyValue = refs.studentCompanyFilter.value;

  const filtered = appState.students.filter((student) => {
    const matchesText = !keyword || student.name.toLowerCase().includes(keyword);
    const matchesCountry = countryValue === 'all' || student.country === countryValue;
    const matchesStatus = statusValue === 'all' || (student.status || 'Active') === statusValue;
    const matchesCompany = companyValue === 'all' || student.company === companyValue;
    return matchesText && matchesCountry && matchesStatus && matchesCompany;
  });

  const rows = filtered.length
    ? filtered
        .map((student) => {
          const status = student.status || 'Active';
          const rate25 = Number(student.rate25 || 0);
          const rate50 = Number(student.rate50 || 0);
          const countryText = student.country || 'Unknown';
          const timezoneText = student.timezone || 'Unknown';
          return `
            <tr class="student-row">
              <td>
                <div class="student-meta">
                  <strong>${student.name}</strong>
                  <span>${student.age ? `${student.age} years` : '—'} · ${student.paymentType || 'Weekly'}</span>
                </div>
              </td>
              <td>${student.company || 'Independent'}</td>
              <td>
                <div class="country-stack">
                  <span>${countryText}</span>
                  <small>${timezoneText}</small>
                </div>
              </td>
              <td>
                <div class="rate-stack">
                  <span>${formatCurrencyAmount(rate25, student.currency || 'PHP')} / 25 min</span>
                  <span>${formatCurrencyAmount(rate50, student.currency || 'PHP')} / 50 min</span>
                </div>
              </td>
              <td><span class="status-pill ${String(status).toLowerCase()}">${status}</span></td>
              <td>
                <div class="action-buttons">
                  <button type="button" class="link-btn" data-action="edit-student" data-id="${student.id}">Edit</button>
                  <button type="button" class="link-btn danger" data-action="delete-student" data-id="${student.id}">Delete</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join('')
    : '<tr><td colspan="6"><div class="empty-state">No students match your filter.</div></td></tr>';

  refs.studentsTableBody.innerHTML = rows;

  refs.studentsTableBody.querySelectorAll('[data-action="edit-student"]').forEach((button) => {
    button.addEventListener('click', () => openStudentModal(button.dataset.id));
  });

  refs.studentsTableBody.querySelectorAll('[data-action="delete-student"]').forEach((button) => {
    button.addEventListener('click', () => deleteStudent(button.dataset.id));
  });

  const countryList = [...new Set([...COUNTRY_OPTIONS, ...appState.students.map((student) => student.country).filter(Boolean)])].sort();
  const companies = [...new Set([...(appState.companies || []), ...appState.students.map((student) => student.company).filter(Boolean)])].sort();

  refs.studentCountryFilter.innerHTML = ['<option value="all">All countries</option>']
    .concat(countryList.map((country) => `<option value="${escapeHtml(country)}">${escapeHtml(country)}</option>`))
    .join('');

  refs.studentCompanyFilter.innerHTML = ['<option value="all">All companies</option>']
    .concat(companies.map((company) => `<option value="${escapeHtml(company)}">${escapeHtml(company)}</option>`))
    .join('');

  refs.studentCountryFilter.value = countryValue || 'all';
  refs.studentStatusFilter.value = statusValue || 'all';
  refs.studentCompanyFilter.value = companyValue || 'all';

  renderCompanyList();
}

function renderCompanyList() {
  const companies = [...new Set([...(appState.companies || []), ...appState.students.map((student) => student.company).filter(Boolean)])].sort();

  if (!refs.companyList) {
    return;
  }

  refs.companyList.innerHTML = companies.length
    ? `
      <div class="company-list-header">
        <strong>Companies</strong>
        <span>${companies.length} saved</span>
      </div>
      <div class="company-badge-wrap">
        ${companies
          .map((company) => `
            <div class="company-badge">
              <span>${company}</span>
              <button type="button" class="company-delete-btn" data-action="delete-company" data-company="${escapeHtml(company)}" aria-label="Delete company ${escapeHtml(company)}">×</button>
            </div>
          `)
          .join('')}
      </div>
    `
    : '<div class="empty-state">No companies saved yet.</div>';

  refs.companyList.querySelectorAll('[data-action="delete-company"]').forEach((button) => {
    button.addEventListener('click', () => deleteCompany(String(button.dataset.company || '').trim()));
  });
}

function deleteCompany(companyName) {
  const safeName = String(companyName || '').trim();
  if (!safeName) return;

  const confirmed = window.confirm(`Delete company “${safeName}”? This will remove it from the company list.`);
  if (!confirmed) return;

  appState.companies = (appState.companies || []).filter((company) => company !== safeName);
  appState.students = appState.students.map((student) =>
    student.company === safeName ? { ...student, company: 'Unassigned' } : student
  );

  persistState();
  renderAll();
}

function renderSchedule() {
  const weekStart = currentScheduleWeek;
  const weekLabels = [];
  const days = [];
  for (let index = 0; index < 7; index += 1) {
    const day = addDays(weekStart, index);
    weekLabels.push({ day, short: formatWeekdayShort(day), date: formatDisplayDate(formatDateInput(day)) });
    days.push(day);
  }

  refs.scheduleWeekLabel.textContent = `Week of ${formatWeekRange(weekLabels[0].day, weekLabels[6].day)}`;

  const slotHeight = 54;
  const dayColumns = days
    .map((day) => {
      const dayKey = formatDateInput(day);
      const classesForDay = appState.classes.filter((item) => item.date === dayKey);
      return `
        <div class="day-column">
          <div class="day-label">${formatWeekdayShort(day)}<br><small>${formatDateShort(day)}</small></div>
          <div class="day-track" data-date="${dayKey}">
            ${buildTimeSlots()}
            ${classesForDay
              .map((item) => {
                const top = getTimePosition(item.startTime, 7 * 60, slotHeight);
                const height = Math.max((Number(item.duration || 0) / 30) * slotHeight, 48);
                const student = getStudentById(item.studentId);
                const color = item.attendance === 'Cancelled' ? 'rgba(195, 90, 90, 0.18)' : item.attendance === 'Present' ? 'rgba(115, 197, 167, 0.25)' : 'rgba(166, 214, 232, 0.22)';
                return `
                  <div class="schedule-class ${item.attendance === 'Cancelled' ? 'is-cancelled' : ''}" data-action="edit-class" data-id="${item.id}" role="button" tabindex="0" style="top:${top}px;height:${height}px;background:${color};">
                    <div class="schedule-class-main">
                      <h4>${student ? student.name : 'Unknown student'}</h4>
                      <p>${item.startTime} • ${item.duration}m</p>
                      <p>${item.attendance}</p>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      `;
    })
    .join('');

  const timeLabels = `
    <div class="time-column">
      <div class="time-label">Time</div>
      ${buildTimeSlots(true)}
    </div>
  `;

  refs.scheduleGrid.innerHTML = `${timeLabels}${dayColumns}`;

  refs.scheduleGrid.querySelectorAll('.day-track').forEach((track) => {
    track.addEventListener('click', (event) => {
      if (event.target.closest('[data-schedule-action]')) {
        return;
      }
      if (event.target.closest('.schedule-class')) {
        return;
      }

      const rect = track.getBoundingClientRect();
      const clickY = event.clientY - rect.top;
      const totalMinutes = (22 - 7) * 60;
      const minutesFromStart = Math.max(0, Math.min(totalMinutes, Math.round((clickY / rect.height) * totalMinutes)));
      const snapped = Math.round(minutesFromStart / 30) * 30;
      const slotMinutes = Math.min(22 * 60, 7 * 60 + snapped);
      const hour = String(Math.floor(slotMinutes / 60)).padStart(2, '0');
      const minute = String(slotMinutes % 60).padStart(2, '0');
      openClassModal(null, { date: track.dataset.date, startTime: `${hour}:${minute}` });
    });
  });

  refs.scheduleGrid.querySelectorAll('.schedule-class').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('[data-schedule-action]')) {
        return;
      }

      const classId = card.dataset.id;
      const classItem = appState.classes.find((item) => item.id === classId);
      if (!classItem) return;

      document.querySelectorAll('.schedule-class.menu-open').forEach((openCard) => {
        if (openCard !== card) {
          openCard.classList.remove('menu-open');
        }
      });

      openScheduleQuickAction(card, classItem);
      card.classList.add('menu-open');
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });

    card.querySelectorAll('[data-schedule-action]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const classId = card.dataset.id;
        const action = button.dataset.scheduleAction;

        if (action === 'edit') {
          openClassModal(classId);
        }
        if (action === 'delete') {
          deleteClass(classId);
        }
        if (action === 'present') {
          updateClassAttendance(classId, 'Present');
        }
        if (action === 'absent') {
          updateClassAttendance(classId, 'Absent');
        }
        if (action === 'cancelled') {
          updateClassAttendance(classId, 'Cancelled');
        }
      });
    });
  });

  const quickAction = document.getElementById('scheduleQuickAction');
  if (quickAction) {
    quickAction.addEventListener('click', (event) => {
      const target = event.target.closest('[data-schedule-action]');
      if (!target) {
        if (event.target.closest('[data-close-quick-action]')) {
          quickAction.classList.add('hidden');
          quickAction.setAttribute('aria-hidden', 'true');
          quickAction.innerHTML = '';
        }
        return;
      }

      const classId = target.dataset.id;
      const action = target.dataset.scheduleAction;

      if (action === 'close-quick-action') {
        quickAction.classList.add('hidden');
        quickAction.setAttribute('aria-hidden', 'true');
        quickAction.innerHTML = '';
        return;
      }

      if (action === 'edit') {
        openClassModal(classId);
      }
      if (action === 'delete') {
        deleteClass(classId);
      }
      if (action === 'present' || action === 'absent' || action === 'cancelled') {
        updateClassAttendance(classId, action === 'present' ? 'Present' : action === 'absent' ? 'Absent' : 'Cancelled');
      }

      quickAction.classList.add('hidden');
      quickAction.setAttribute('aria-hidden', 'true');
      quickAction.innerHTML = '';
    });
  }
}

function openScheduleQuickAction(card, classItem) {
  const quickAction = document.getElementById('scheduleQuickAction');
  if (!quickAction) return;

  const student = getStudentById(classItem.studentId);
  const endMinutes = timeToMinutes(classItem.startTime) + Number(classItem.duration || 0);
  const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;
  const dateText = `${formatDisplayDate(classItem.date)} • ${classItem.startTime}–${endTime}`;
  const attendance = classItem.attendance || 'Scheduled';

  quickAction.innerHTML = `
    <div class="schedule-quick-card">
      <button type="button" class="quick-close" data-schedule-action="close-quick-action" data-close-quick-action="true" aria-label="Close popup">×</button>
      <h3>${student ? student.name : 'Unknown student'}</h3>
      <div class="quick-date">${dateText}</div>
      <div class="quick-status-row">
        <button type="button" class="quick-status present ${attendance === 'Present' ? 'selected' : ''}" data-schedule-action="present" data-id="${classItem.id}">Present</button>
        <button type="button" class="quick-status absent ${attendance === 'Absent' ? 'selected' : ''}" data-schedule-action="absent" data-id="${classItem.id}">Absent</button>
        <button type="button" class="quick-status cancelled ${attendance === 'Cancelled' ? 'selected' : ''}" data-schedule-action="cancelled" data-id="${classItem.id}">Cancelled</button>
      </div>
      <div class="quick-secondary-actions">
        <button type="button" data-schedule-action="edit" data-id="${classItem.id}">Edit class</button>
        <button type="button" class="danger-action" data-schedule-action="delete" data-id="${classItem.id}">Delete class</button>
      </div>
    </div>
  `;

  quickAction.classList.remove('hidden');
  quickAction.setAttribute('aria-hidden', 'false');

  const cardRect = card.getBoundingClientRect();
  const popoverWidth = 260;
  const popoverHeight = quickAction.offsetHeight || 220;
  const padding = 20;
  const maxLeft = window.innerWidth - popoverWidth - padding;
  const maxTop = window.innerHeight - popoverHeight - padding;

  let left = cardRect.left + 20;
  let top = cardRect.top + 12;

  if (left + popoverWidth > window.innerWidth - padding) {
    left = cardRect.right - popoverWidth - 12;
  }

  if (top + popoverHeight > window.innerHeight - padding) {
    top = Math.max(padding, maxTop);
  }

  left = Math.max(padding, Math.min(left, maxLeft));
  top = Math.max(padding, Math.min(top, maxTop));

  quickAction.style.left = `${left}px`;
  quickAction.style.top = `${top}px`;
}

function renderPayments() {
  const statusFilter = refs.paymentStatusFilter.value;
  const studentFilter = refs.paymentStudentFilter.value;
  const fromDate = refs.paymentFromDate.value;
  const toDate = refs.paymentToDate.value;

  const filtered = appState.payments.filter((payment) => {
    const byStatus = statusFilter === 'all' || payment.status === statusFilter;
    const byStudent = studentFilter === 'all' || payment.studentId === studentFilter;
    const byFrom = !fromDate || payment.classDate >= fromDate;
    const byTo = !toDate || payment.classDate <= toDate;
    return byStatus && byStudent && byFrom && byTo;
  });

  const totalPending = filtered.reduce((sum, item) => (item.status === 'Pending' ? sum + convertCurrencyValue(Number(item.subtotal || item.amount || 0), item.currency, appState.settings.defaultCurrency) : sum), 0);
  const totalPaid = filtered.reduce((sum, item) => (item.status === 'Paid' ? sum + convertCurrencyValue(Number(item.subtotal || item.amount || 0), item.currency, appState.settings.defaultCurrency) : sum), 0);
  const totalAll = filtered.reduce((sum, item) => sum + convertCurrencyValue(Number(item.subtotal || item.amount || 0), item.currency, appState.settings.defaultCurrency), 0);

  refs.paymentTotalsStrip.innerHTML = `
    <div class="total-box">
      <span class="label">Paid</span>
      <strong>${formatCurrencyAmount(totalPaid, appState.settings.defaultCurrency)}</strong>
    </div>
    <div class="total-box">
      <span class="label">Pending</span>
      <strong>${formatCurrencyAmount(totalPending, appState.settings.defaultCurrency)}</strong>
    </div>
    <div class="total-box">
      <span class="label">Total</span>
      <strong>${formatCurrencyAmount(totalAll, appState.settings.defaultCurrency)}</strong>
    </div>
    <div class="total-box">
      <span class="label">Records</span>
      <strong>${filtered.length}</strong>
    </div>
  `;

  const groupedByStudentWeek = new Map();

  filtered.forEach((payment) => {
    const studentId = payment.studentId;
    const weekKey = payment.weekStart || payment.classDate;

    if (!groupedByStudentWeek.has(studentId)) {
      groupedByStudentWeek.set(studentId, new Map());
    }

    const studentWeeks = groupedByStudentWeek.get(studentId);
    if (!studentWeeks.has(weekKey)) {
      studentWeeks.set(weekKey, []);
    }

    studentWeeks.get(weekKey).push(payment);
  });

  const paymentCards = Array.from(groupedByStudentWeek.entries())
    .sort(([leftId], [rightId]) => (getStudentById(leftId)?.name || '').localeCompare(getStudentById(rightId)?.name || ''))
    .flatMap(([studentId, studentWeeks]) => {
      const student = getStudentById(studentId);
      const studentName = student?.name || 'Unknown student';
      const studentCountry = student?.country || 'Unknown';

      return Array.from(studentWeeks.entries())
        .sort(([left], [right]) => new Date(right) - new Date(left))
        .map(([weekKey, weekPayments]) => {
          const status = weekPayments.every((payment) => payment.status === 'Paid') ? 'Paid' : 'Pending';
          const weeklyTotal = weekPayments.reduce((sum, payment) => sum + convertCurrencyValue(Number(payment.subtotal || payment.amount || 0), payment.currency, appState.settings.defaultCurrency || 'PHP'), 0);

          return `
            <div class="payment-card">
              <div class="payment-card-header">
                <span>WEEK OF ${getWeekLabel(weekKey)}</span>
                <span class="payment-pill ${String(status).toLowerCase()}">${status}</span>
              </div>

              <div class="payment-student-row">
                <div class="payment-student-meta">
                  <h3>${studentName}</h3>
                  <p>${weekPayments.length} payable class${weekPayments.length === 1 ? '' : 'es'}</p>
                  <p>${studentCountry}</p>
                </div>
                <div class="payment-student-total">${formatCurrencyAmount(weeklyTotal, appState.settings.defaultCurrency || 'PHP')}</div>
              </div>

              <div class="payment-entry-list">
                ${weekPayments
                  .map((payment) => {
                    const amount = Number(payment.subtotal || payment.amount || 0);
                    const paymentStatus = payment.status === 'Paid' ? 'Paid' : 'Pending';
                    const attendance = payment.attendance || 'Scheduled';
                    return `
                      <div class="payment-entry">
                        <div class="payment-entry-meta">
                          <span>${formatDisplayDate(payment.classDate)} • ${payment.duration} min • ${attendance}</span>
                          <small>${payment.company || student?.company || 'Independent'}</small>
                        </div>
                        <div class="payment-entry-amounts">
                          <strong>${formatCurrencyAmount(amount, payment.currency)}</strong>
                          <span class="payment-inline-pill ${paymentStatus.toLowerCase()}">${paymentStatus}</span>
                        </div>
                      </div>
                    `;
                  })
                  .join('')}
              </div>

              <div class="payment-card-footer">
                <span>Weekly subtotal</span>
                <strong>${formatCurrencyAmount(weeklyTotal, appState.settings.defaultCurrency || 'PHP')}</strong>
              </div>

              <div class="payment-card-actions">
                <button type="button" class="link-btn" data-action="mark-paid" data-ids="${weekPayments.map((payment) => payment.id).join(',')}">${status === 'Paid' ? 'Paid' : 'Mark paid'}</button>
                <button type="button" class="link-btn" data-action="mark-unpaid" data-ids="${weekPayments.map((payment) => payment.id).join(',')}">${status === 'Pending' ? 'Unpaid' : 'Mark unpaid'}</button>
              </div>
            </div>
          `;
        });
    })
    .flat();

  refs.paymentsList.innerHTML = paymentCards.length
    ? paymentCards.join('')
    : '<div class="empty-state">No payment records match these filters.</div>';

  refs.paymentsList.querySelectorAll('[data-action="mark-paid"]').forEach((button) => {
    button.addEventListener('click', () => {
      const ids = button.dataset.ids ? button.dataset.ids.split(',').filter(Boolean) : [];
      setPaymentStatus(ids, 'Paid');
    });
  });

  refs.paymentsList.querySelectorAll('[data-action="mark-unpaid"]').forEach((button) => {
    button.addEventListener('click', () => {
      const ids = button.dataset.ids ? button.dataset.ids.split(',').filter(Boolean) : [];
      setPaymentStatus(ids, 'Pending');
    });
  });

  renderPaymentBreakdown(filtered);
}

function renderPaymentBreakdown(filteredPayments) {
  const byStudent = {};
  const byWeek = {};

  filteredPayments.forEach((payment) => {
    const studentTotal = convertCurrencyValue(Number(payment.subtotal || payment.amount || 0), payment.currency, appState.settings.defaultCurrency || 'PHP');
    byStudent[payment.studentId] = (byStudent[payment.studentId] || 0) + studentTotal;
    byWeek[payment.weekStart || payment.classDate] = (byWeek[payment.weekStart || payment.classDate] || 0) + studentTotal;
  });

  const studentEntries = Object.entries(byStudent);
  const weekEntries = Object.entries(byWeek);

  if (!refs.paymentBreakdown) {
    return;
  }

  refs.paymentBreakdown.innerHTML = `
    <div class="payment-breakdown-grid">
      <div class="payment-breakdown-section">
        <h4>Student totals</h4>
        ${studentEntries.length
          ? studentEntries
              .map(([studentId, total]) => {
                const student = getStudentById(studentId);
                return `
                  <div class="breakdown-row">
                    <span>${student ? student.name : 'Unknown student'}</span>
                    <strong>${formatCurrencyAmount(total, appState.settings.defaultCurrency || 'PHP')}</strong>
                  </div>
                `;
              })
              .join('')
          : '<div class="empty-state">No student totals.</div>'}
      </div>
      <div class="payment-breakdown-section">
        <h4>Weekly totals</h4>
        ${weekEntries.length
          ? weekEntries
              .map(([week, total]) => `
                <div class="breakdown-row">
                  <span>${getWeekLabel(week)}</span>
                  <strong>${formatCurrencyAmount(total, appState.settings.defaultCurrency || 'PHP')}</strong>
                </div>
              `)
              .join('')
          : '<div class="empty-state">No weekly totals.</div>'}
      </div>
    </div>
  `;
}

function renderClassRecords() {
  const currentMonthKey = getCurrentMonthKey();
  const selectedMonth = (refs.recordMonthInput && refs.recordMonthInput.value) || currentMonthKey;
  if (refs.recordMonthInput) {
    refs.recordMonthInput.value = selectedMonth;
  }

  const searchText = refs.recordSearch.value.trim().toLowerCase();
  const attendanceFilter = refs.recordStatusFilter.value;

  const filtered = appState.classes.filter((item) => {
    const student = getStudentById(item.studentId);
    const matchesText = !searchText || [student?.name || '', item.notes || '', item.classType, item.attendance].join(' ').toLowerCase().includes(searchText);
    const matchesStatus = attendanceFilter === 'all' || item.attendance === attendanceFilter;
    const matchesMonth = !item.date || item.date.startsWith(selectedMonth);
    return matchesText && matchesStatus && matchesMonth;
  });

  refs.recordsTableBody.innerHTML = filtered.length
    ? filtered
        .map((item) => {
          const student = getStudentById(item.studentId);
          const payment = appState.payments.find((entry) => entry.classId === item.id);
          const amount = payment ? formatCurrencyAmount(Number(payment.subtotal || payment.amount || 0), payment.currency) : '—';
          const paymentStatus = payment ? payment.status : 'Not payable';
          return `
            <tr class="record-row">
              <td>${formatDisplayDate(item.date)}</td>
              <td>${student ? student.name : 'Unknown'}</td>
              <td>${item.duration} min</td>
              <td>${item.classType}</td>
              <td><span class="attendance-pill ${String(item.attendance || 'Scheduled').toLowerCase()}">${item.attendance || 'Scheduled'}</span></td>
              <td>${item.notes || '—'}</td>
              <td>${amount}</td>
              <td><span class="payment-pill ${String(paymentStatus === 'Paid' ? 'paid' : paymentStatus === 'Pending' ? 'pending' : 'inactive')}">${paymentStatus}</span></td>
              <td>
                <div class="action-buttons">
                  <button type="button" class="link-btn" data-action="edit-class" data-id="${item.id}">Edit</button>
                  <button type="button" class="link-btn danger" data-action="delete-class" data-id="${item.id}">Delete</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join('')
    : '<tr><td colspan="9"><div class="empty-state">No class records found.</div></td></tr>';

  refs.recordsTableBody.querySelectorAll('[data-action="edit-class"]').forEach((button) => {
    button.addEventListener('click', () => openClassModal(button.dataset.id));
  });

  refs.recordsTableBody.querySelectorAll('[data-action="delete-class"]').forEach((button) => {
    button.addEventListener('click', () => deleteClass(button.dataset.id));
  });
}

function renderReports() {
  const reportMonth = getCurrentMonthKey();
  syncLiveMonthSelection();

  const monthClasses = appState.classes.filter((item) => item.date.startsWith(reportMonth));
  const monthPayments = appState.payments.filter((payment) => (payment.classDate || '').startsWith(reportMonth));

  const paidTotal = monthPayments.filter((entry) => entry.status === 'Paid').reduce((sum, entry) => sum + convertCurrencyValue(Number(entry.subtotal || entry.amount || 0), entry.currency, appState.settings.defaultCurrency), 0);
  const pendingTotal = monthPayments.filter((entry) => entry.status === 'Pending').reduce((sum, entry) => sum + convertCurrencyValue(Number(entry.subtotal || entry.amount || 0), entry.currency, appState.settings.defaultCurrency), 0);
  const totalMonthValue = monthPayments.reduce((sum, entry) => sum + convertCurrencyValue(Number(entry.subtotal || entry.amount || 0), entry.currency, appState.settings.defaultCurrency), 0);
  const cancelledCount = monthClasses.filter((entry) => entry.attendance === 'Cancelled').length;
  const minutes = monthClasses.reduce((sum, entry) => sum + Number(entry.duration || 0), 0);

  refs.reportPaidValue.textContent = formatCurrencyAmount(paidTotal, appState.settings.defaultCurrency);
  refs.reportPendingValue.textContent = formatCurrencyAmount(pendingTotal, appState.settings.defaultCurrency);
  refs.reportTotalValue.textContent = formatCurrencyAmount(totalMonthValue, appState.settings.defaultCurrency);
  refs.reportCancelledValue.textContent = String(cancelledCount);
  refs.reportMinutesValue.textContent = String(minutes);

  const presentCount = monthClasses.filter((entry) => entry.attendance === 'Present').length;
  const absentCount = monthClasses.filter((entry) => entry.attendance === 'Absent').length;
  const cancelledTotal = monthClasses.filter((entry) => entry.attendance === 'Cancelled').length;
  const totalAttendance = Math.max(presentCount + absentCount + cancelledTotal, 1);

  const attendanceData = [
    { label: 'Present', count: presentCount, className: 'present' },
    { label: 'Absent', count: absentCount, className: 'absent' },
    { label: 'Cancelled', count: cancelledTotal, className: 'cancelled' }
  ];

  refs.attendanceBars.innerHTML = attendanceData
    .map((entry) => {
      const percent = Math.round((entry.count / totalAttendance) * 100);
      return `
        <div class="attendance-row">
          <strong>${entry.label}</strong>
          <div class="progress-track">
            <div class="progress-bar ${entry.className}" style="width:${percent}%"></div>
          </div>
          <span>${entry.count}</span>
        </div>
      `;
    })
    .join('');

  const revenueByStudent = monthPayments.reduce((accumulator, payment) => {
    const key = payment.studentId || payment.studentName;
    const converted = convertCurrencyValue(Number(payment.subtotal || payment.amount || 0), payment.currency, appState.settings.defaultCurrency);
    accumulator[key] = (accumulator[key] || 0) + converted;
    return accumulator;
  }, {});

  const revenueEntries = Object.entries(revenueByStudent);
  refs.revenueByStudent.innerHTML = revenueEntries.length
    ? revenueEntries
        .map(([key, total]) => {
          const match = appState.students.find((student) => student.id === key);
          const label = match ? match.name : key;
          return `
            <div class="rev-item">
              <span>${label}</span>
              <strong>${formatCurrencyAmount(total, appState.settings.defaultCurrency)}</strong>
            </div>
          `;
        })
        .join('')
    : '<div class="empty-state">No revenue data for this month.</div>';
}

function updateSelectedExchangeRateInput() {
  if (!refs.exchangeRateCurrencyInput || !refs.exchangeRateValueInput) {
    return;
  }

  const selectedCurrency = String(refs.exchangeRateCurrencyInput.value || appState.settings.defaultCurrency || 'PHP').trim().toUpperCase();
  const selectedRate = Number(appState.settings.exchangeRates?.[selectedCurrency] ?? getExchangeRate(selectedCurrency) ?? 1);
  refs.exchangeRateValueInput.value = String(selectedRate);
}

function getCurrencyLabel(currency) {
  return CURRENCY_LABELS[currency] || currency;
}

function renderExchangeRates() {
  if (!refs.exchangeRateCurrencyInput || !refs.exchangeRateList) {
    return;
  }

  const allCurrencies = [...new Set([...CURRENCY_OPTIONS, appState.settings.defaultCurrency, ...appState.students.map((student) => student.currency).filter(Boolean)])].sort();
  refs.exchangeRateCurrencyInput.innerHTML = allCurrencies
    .map((currency) => `<option value="${escapeHtml(currency)}">${escapeHtml(currency)} — ${escapeHtml(getCurrencyLabel(currency))}</option>`)
    .join('');

  const selectedCurrency = refs.exchangeRateCurrencyInput.value || appState.settings.defaultCurrency || 'PHP';
  refs.exchangeRateCurrencyInput.value = allCurrencies.includes(selectedCurrency) ? selectedCurrency : 'PHP';

  updateSelectedExchangeRateInput();

  refs.exchangeRateList.innerHTML = allCurrencies
    .map((currency) => {
      const phpValue = getExchangeRate(currency);
      return `
        <div class="exchange-rate-row ${currency === selectedCurrency ? 'selected' : ''}">
          <span>${currency}</span>
          <div class="exchange-rate-input-wrap">
            <input
              class="exchange-rate-input"
              type="text"
              inputmode="decimal"
              pattern="[0-9]*[.]?[0-9]*"
              data-exchange-currency="${escapeHtml(currency)}"
              value="${Number(phpValue).toFixed(2)}"
              aria-label="${escapeHtml(currency)} exchange rate to PHP"
            />
            <strong>PHP</strong>
          </div>
        </div>
      `;
    })
    .join('');

  document.querySelectorAll('.exchange-rate-input').forEach((input) => {
    input.addEventListener('change', (event) => {
      const currency = event.target.dataset.exchangeCurrency;
      if (!currency) return;
      const rawValue = String(event.target.value || '').trim();
      const sanitizedValue = rawValue
        .replace(/,/g, '.')
        .replace(/[^0-9.]/g, '')
        .replace(/\.(?=.*\.)/g, '');
      const nextRate = Number(sanitizedValue || 1);
      appState.settings.exchangeRates[currency] = Number.isFinite(nextRate) ? nextRate : 1;
      persistState();
      reconcilePaymentRecords({ preserveHistoricalRate: false });
      renderAll();
    });
  });
}

function renderSettings() {
  const currencyOptions = [...new Set([...CURRENCY_OPTIONS, appState.settings.defaultCurrency, ...appState.students.map((student) => student.currency).filter(Boolean)])];
  refs.defaultCurrencyInput.innerHTML = currencyOptions
    .map((currency) => `<option value="${escapeHtml(currency)}">${escapeHtml(currency)}</option>`)
    .join('');

  const studentCheckboxes = document.getElementById('milestoneStudentCheckboxes');
  if (studentCheckboxes) {
    studentCheckboxes.innerHTML = appState.students.length
      ? appState.students
          .map((student) => `
            <label class="reminder-choice-option">
              <input type="checkbox" name="milestoneStudentCheckbox" value="${escapeHtml(student.id)}" />
              <span>${escapeHtml(student.name)}</span>
            </label>
          `)
          .join('')
      : '<div class="empty-state small">No students available.</div>';
  }

  if (refs.milestoneReminderList) {
    refs.milestoneReminderList.innerHTML = (appState.settings.milestoneReminders || []).length
      ? (appState.settings.milestoneReminders || [])
          .map((entry) => {
            const student = getStudentById(entry.studentId);
            if (!student) {
              return '';
            }
            return `
              <div class="reminder-chip">
                <span>${escapeHtml(student.name)} · ${Number(entry.threshold)} classes</span>
                <button type="button" class="mini-action danger" data-reminder-delete="true" data-reminder-student="${escapeHtml(student.id)}" data-reminder-threshold="${Number(entry.threshold)}">Remove</button>
              </div>
            `;
          })
          .filter(Boolean)
          .join('')
      : '<div class="empty-state small">No milestone reminders set.</div>';

    refs.milestoneReminderList.querySelectorAll('[data-reminder-delete]').forEach((button) => {
      button.addEventListener('click', () => {
        removeMilestoneReminder(String(button.dataset.reminderStudent || ''), Number(button.dataset.reminderThreshold || 0));
      });
    });
  }

  refs.teacherNameInput.value = appState.settings.teacherName || DEFAULT_SETTINGS.teacherName;
  refs.dashboardTitleInput.value = appState.settings.dashboardTitle || DEFAULT_SETTINGS.dashboardTitle;
  refs.settingsQuoteInput.value = appState.settings.quote || DEFAULT_SETTINGS.quote;
  refs.defaultCurrencyInput.value = appState.settings.defaultCurrency || DEFAULT_SETTINGS.defaultCurrency;
  refs.phpRateInput.value = String(appState.settings.phpRate || DEFAULT_SETTINGS.phpRate);
  refs.themeInput.value = appState.settings.theme || DEFAULT_SETTINGS.theme;
  refs.fontInput.value = appState.settings.font || DEFAULT_SETTINGS.font;
  refs.timezoneInput.value = appState.settings.teacherTimezone || DEFAULT_SETTINGS.teacherTimezone;
  refs.reminderSettingsInput.value = appState.settings.reminderSettings || DEFAULT_SETTINGS.reminderSettings;
  applyProfileImage();
  renderExchangeRates();
}

function populateStaticFilters() {
  const studentOptions = appState.students
    .map((student) => `<option value="${student.id}">${student.name}</option>`)
    .join('');

  refs.paymentStudentFilter.innerHTML = `<option value="all">All students</option>${studentOptions}`;
  refs.paymentStudentFilter.value = refs.paymentStudentFilter.dataset.value || 'all';
  refs.classStudentSelect.innerHTML = appState.students
    .map((student) => `<option value="${student.id}">${student.name}</option>`)
    .join('');
}

function populateStudentFormLookups() {
  const countrySelect = refs.studentForm.querySelector('[name="country"]');
  const currencySelect = refs.studentForm.querySelector('[name="currency"]');
  const companyInput = refs.studentForm.querySelector('[name="company"]');
  const companySuggestions = document.getElementById('companySuggestions');

  if (countrySelect) {
    const selectedValue = countrySelect.value || 'Philippines';
    const combinedCountries = [...new Set([...COUNTRY_OPTIONS, ...appState.students.map((student) => student.country).filter(Boolean)])].sort();
    countrySelect.innerHTML = combinedCountries.map((country) => `<option value="${escapeHtml(country)}">${escapeHtml(country)}</option>`).join('');
    countrySelect.value = combinedCountries.includes(selectedValue) ? selectedValue : 'Philippines';
  }

  if (currencySelect) {
    const selectedCurrency = currencySelect.value || appState.settings.defaultCurrency || 'PHP';
    const combinedCurrencies = [...new Set([...CURRENCY_OPTIONS, ...(appState.students.map((student) => student.currency).filter(Boolean))])];
    currencySelect.innerHTML = combinedCurrencies.map((currency) => `<option value="${escapeHtml(currency)}">${escapeHtml(currency)}</option>`).join('');
    currencySelect.value = combinedCurrencies.includes(selectedCurrency) ? selectedCurrency : appState.settings.defaultCurrency || 'PHP';
  }

  if (companyInput && companySuggestions) {
    const combinedCompanies = [...new Set([...(appState.companies || []), ...appState.students.map((student) => student.company).filter(Boolean)])].sort();
    companySuggestions.innerHTML = combinedCompanies.map((company) => `<option value="${escapeHtml(company)}"></option>`).join('');
  }
}

function addCompany(companyName) {
  const cleanName = String(companyName || '').trim();
  if (!cleanName) return;

  appState.companies = [...new Set([...(appState.companies || []), cleanName])].sort();
  persistState();
}

function openCompanyModal() {
  refs.companyForm.reset();
  refs.companyModal.classList.remove('hidden');
  refs.companyModal.setAttribute('aria-hidden', 'false');
}

function openStudentModal(studentId = null) {
  studentModalEditingId = studentId;
  refs.studentForm.reset();
  populateStudentFormLookups();
  refs.studentModalTitle.textContent = studentId ? 'Edit Student' : 'Add Student';

  if (studentId) {
    const student = appState.students.find((entry) => entry.id === studentId);
    if (!student) return;

    refs.studentForm.querySelector('[name="name"]').value = student.name || '';
    refs.studentForm.querySelector('[name="age"]').value = student.age || 0;
    refs.studentForm.querySelector('[name="company"]').value = student.company || '';
    refs.studentForm.querySelector('[name="country"]').value = student.country || 'Philippines';
    refs.studentForm.querySelector('[name="timezone"]').value = student.timezone || (COUNTRY_TIMEZONE_MAP[student.country] || 'UTC');
    refs.studentForm.querySelector('[name="currency"]').value = student.currency || appState.settings.defaultCurrency;
    refs.studentForm.querySelector('[name="paymentType"]').value = student.paymentType || 'Weekly';
    refs.studentForm.querySelector('[name="bookMaterial"]').value = student.bookMaterial || '';
    refs.studentForm.querySelector('[name="startDate"]').value = student.startDate || '';
    refs.studentForm.querySelector('[name="status"]').value = student.status || 'Active';
    refs.studentForm.querySelector('[name="rate25"]').value = student.rate25 || 0;
    refs.studentForm.querySelector('[name="rate50"]').value = student.rate50 || 0;
    refs.studentForm.querySelector('[name="notes"]').value = student.notes || '';
  } else {
    refs.studentForm.querySelector('[name="country"]').value = 'Philippines';
    refs.studentForm.querySelector('[name="timezone"]').value = 'Asia/Manila';
    refs.studentForm.querySelector('[name="currency"]').value = appState.settings.defaultCurrency || 'PHP';
  }

  refs.studentModal.classList.remove('hidden');
  refs.studentModal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  refs.classFormWarning.classList.add('hidden');
  refs.classFormWarning.textContent = '';
  refs.classForm.reset();
  refs.companyForm.reset();
  classModalEditingId = null;
  studentModalEditingId = null;
}

function openClassModal(classId = null, defaults = {}) {
  classModalEditingId = classId;
  refs.classForm.reset();
  refs.classFormWarning.classList.add('hidden');
  refs.classFormWarning.textContent = '';
  refs.classModalTitle.textContent = classId ? 'Edit Class' : 'Add Class';

  populateStaticFilters();

  const defaultDate = defaults.date || formatDateInput(stripTime(new Date()));
  const defaultTime = defaults.startTime || '09:00';
  refs.classForm.querySelector('[name="date"]').value = defaultDate;
  refs.classForm.querySelector('[name="duration"]').value = '50';
  refs.classForm.querySelector('[name="classType"]').value = 'Regular';
  refs.classForm.querySelector('[name="startTime"]').value = defaultTime;
  refs.classForm.querySelector('[name="repeatCount"]').value = '0';

  if (classId) {
    const currentClass = appState.classes.find((entry) => entry.id === classId);
    if (currentClass) {
      refs.classForm.querySelector('[name="studentId"]').value = currentClass.studentId || '';
      refs.classForm.querySelector('[name="date"]').value = currentClass.date || defaultDate;
      refs.classForm.querySelector('[name="startTime"]').value = currentClass.startTime || defaultTime;
      refs.classForm.querySelector('[name="duration"]').value = String(currentClass.duration || 50);
      refs.classForm.querySelector('[name="classType"]').value = currentClass.classType || 'Regular';
      refs.classForm.querySelector('[name="notes"]').value = currentClass.notes || '';
      refs.classForm.querySelector('[name="repeatCount"]').value = '0';
    }
  }

  refs.classModal.classList.remove('hidden');
  refs.classModal.setAttribute('aria-hidden', 'false');
}

function deleteStudent(studentId) {
  const student = appState.students.find((entry) => entry.id === studentId);
  if (!student) return;

  const confirmed = window.confirm(`Delete ${student.name}? This will also remove their classes and payment records.`);
  if (!confirmed) return;

  appState.students = appState.students.filter((entry) => entry.id !== studentId);
  appState.classes = appState.classes.filter((entry) => entry.studentId !== studentId);
  appState.payments = appState.payments.filter((entry) => entry.studentId !== studentId);
  persistState();
  renderAll();
}

function deleteClass(classId) {
  const currentClass = appState.classes.find((entry) => entry.id === classId);
  if (!currentClass) return;

  const confirmed = window.confirm('Delete this class and its payment record?');
  if (!confirmed) return;

  appState.classes = appState.classes.filter((entry) => entry.id !== classId);
  appState.payments = appState.payments.filter((entry) => entry.classId !== classId);
  reconcilePaymentRecords({ preserveHistoricalRate: false });
  persistState();
  renderAll();
}

function setPaymentStatus(paymentIdOrIds, status) {
  const ids = (Array.isArray(paymentIdOrIds) ? paymentIdOrIds : [paymentIdOrIds]).map((id) => String(id));

  appState.payments = appState.payments.map((payment) => {
    if (ids.includes(String(payment.id))) {
      return { ...payment, status };
    }
    return payment;
  });
  persistState();
  renderAll();
}

function updateClassAttendance(classId, attendance) {
  appState.classes = appState.classes.map((item) => {
    if (item.id !== classId) return item;
    return { ...item, attendance };
  });
  reconcilePaymentRecords({ preserveHistoricalRate: false });
  persistState();
  renderAll();
}

function detectOverlap(candidate) {
  if (!candidate.studentId || !candidate.date || !candidate.startTime || !candidate.duration) {
    return false;
  }

  const startMinutes = timeToMinutes(candidate.startTime);
  const endMinutes = startMinutes + Number(candidate.duration);

  return appState.classes.some((existing) => {
    if (existing.id === candidate.id) return false;
    if (existing.date !== candidate.date) return false;
    const existingStart = timeToMinutes(existing.startTime);
    const existingEnd = existingStart + Number(existing.duration);
    return startMinutes < existingEnd && endMinutes > existingStart;
  });
}

function reconcilePaymentRecords({ preserveHistoricalRate = true } = {}) {
  const nextPayments = [];

  for (const currentClass of appState.classes) {
    const student = getStudentById(currentClass.studentId);
    if (!student) continue;

    const payable = isClassPayable(currentClass, student);
    if (!payable) {
      continue;
    }

    const previous = appState.payments.find((payment) => payment.classId === currentClass.id);
    const rate = getRateForClass(student, currentClass.duration);
    const exchangeRate = getExchangeRate(student.currency || appState.settings.defaultCurrency);
    const amount = roundMoney(Number(rate));

    const record = {
      id: previous?.id || generateId('payment'),
      classId: currentClass.id,
      studentId: currentClass.studentId,
      studentName: student.name,
      company: student.company,
      currency: student.currency || appState.settings.defaultCurrency,
      classes: 1,
      classDate: currentClass.date,
      duration: currentClass.duration,
      attendance: currentClass.attendance,
      rate: preserveHistoricalRate && previous ? previous.rate : rate,
      subtotal: preserveHistoricalRate && previous ? previous.subtotal : amount,
      status: previous?.status || 'Pending',
      weekStart: getWeekStartISO(currentClass.date),
      appliedRate: preserveHistoricalRate && previous ? previous.appliedRate : rate,
      appliedExchangeRate: preserveHistoricalRate && previous ? previous.appliedExchangeRate : exchangeRate,
      finalPhpAmount: preserveHistoricalRate && previous ? previous.finalPhpAmount : roundMoney(amount * exchangeRate)
    };

    nextPayments.push(record);
  }

  appState.payments = nextPayments;
}

function getWeekStartISO(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  const monday = getStartOfWeek(date);
  return formatDateInput(monday);
}

function formatCurrencyAmount(value, currency) {
  const normalizedCurrency = currency || appState.settings.defaultCurrency || 'PHP';
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: normalizedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(Number(value || 0));
  } catch (_error) {
    return `${normalizedCurrency} ${Number(value || 0).toFixed(2)}`;
  }
}

function formatDisplayDate(dateString) {
  if (!dateString) return '—';
  try {
    return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (_error) {
    return dateString;
  }
}

function formatDateShort(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateInput(date) {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function stripTime(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function addDays(date, amount) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + amount);
  return clone;
}

function getStartOfWeek(date) {
  const clone = new Date(date);
  const day = clone.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  clone.setDate(clone.getDate() + diff);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function getCurrentWeekRange() {
  const monday = getStartOfWeek(new Date());
  const sunday = addDays(monday, 6);
  return { monday, sunday };
}

function formatWeekRange(start, end) {
  const startText = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(start);
  const endText = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(end);
  return `${startText} - ${endText}`;
}

function getGreeting(date) {
  const hour = date.getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

function updateHeaderTime() {
  const now = new Date();
  refs.currentTime.textContent = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  refs.currentDate.textContent = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getStudentById(studentId) {
  return appState.students.find((student) => student.id === studentId) || null;
}

function getRateForClass(student, duration) {
  if (!student) return 0;
  const minutes = Number(duration || 0);
  if (minutes <= 30) {
    return Number(student.rate25 || 0);
  }
  return Number(student.rate50 || 0);
}

function isClassPayable(classItem, student) {
  if (!student) return false;

  const attendance = String(classItem.attendance || '').toLowerCase();
  const classType = String(classItem.classType || '').toLowerCase();

  if (attendance === 'cancelled' || attendance === 'scheduled') return false;
  if (classType === 'trial' || classType === 'free') return false;
  if (attendance === 'present' || attendance === 'absent' || attendance === 'makeup') return true;
  return false;
}

function roundMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

function getExchangeRate(currency) {
  const normalized = currency || appState.settings.defaultCurrency || 'PHP';
  const exchangeRate = (appState.settings.exchangeRates && appState.settings.exchangeRates[normalized]) || 1;
  return Number(exchangeRate || 1);
}

function convertCurrencyValue(value, fromCurrency, toCurrency) {
  const originalValue = Number(value || 0);
  const fromCode = fromCurrency || appState.settings.defaultCurrency || 'PHP';
  const toCode = toCurrency || appState.settings.defaultCurrency || 'PHP';

  if (fromCode === toCode) return originalValue;

  const fromRate = getExchangeRate(fromCode);
  const toRate = getExchangeRate(toCode);

  return originalValue * (fromRate / toRate);
}

function timeToMinutes(value) {
  if (!value) return 0;
  const [hour, minute] = String(value).split(':').map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

function getTimePosition(startTime, dayStartMinutes, slotHeight) {
  const minutes = timeToMinutes(startTime);
  const offsetMinutes = Math.max(minutes - dayStartMinutes, 0);
  return (offsetMinutes / 30) * slotHeight;
}

function buildTimeSlots(includeLabels = false) {
  const startHour = 6;
  const endHour = 23;
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === endHour && minute === 30) continue;
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      if (includeLabels) {
        slots.push(`<div class="time-slot time-slot-label"><span>${time}</span></div>`);
      } else {
        slots.push('<div class="time-slot"></div>');
      }
    }
  }
  return slots.join('');
}

function isWithinCurrentWeek(dateString) {
  const currentRange = getCurrentWeekRange();
  const targetDate = new Date(`${dateString}T00:00:00`);
  return targetDate >= currentRange.monday && targetDate <= currentRange.sunday;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`;
}

function getWeekLabel(weekStart) {
  const date = new Date(`${weekStart || new Date().toISOString().slice(0, 10)}T00:00:00`);
  return `W ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)}`;
}

function formatWeekdayShort(date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
}

function padStart(value, targetLength, padString) {
  return String(value).padStart(targetLength, padString);
}

function applyTheme(themeName) {
  const normalized = themeName || 'soft';
  document.body.setAttribute('data-theme', normalized);
}

function applyFont(fontName) {
  const normalized = fontName || 'serif';
  document.body.setAttribute('data-font', normalized);
}

function handleProfileImageUpload(event) {
  const input = event.target;
  const [file] = input.files || [];

  if (!file || !file.type || !file.type.startsWith('image/')) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    appState.settings.profileImage = String(reader.result || '');
    persistState();
    renderHeader();
    renderSettings();
    input.value = '';
  };
  reader.readAsDataURL(file);
}

function applyProfileImage() {
  const avatar = refs.profileAvatar;
  const preview = refs.profileImagePreview;
  const name = (appState.settings.teacherName || DEFAULT_SETTINGS.teacherName || 'V').trim();
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'V';

  if (avatar) {
    avatar.textContent = initials;
    if (appState.settings.profileImage) {
      avatar.style.backgroundImage = `url("${appState.settings.profileImage}")`;
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';
      avatar.style.color = 'transparent';
      avatar.classList.add('has-image');
    } else {
      avatar.style.backgroundImage = 'none';
      avatar.style.color = '';
      avatar.classList.remove('has-image');
    }
  }

  if (preview) {
    preview.innerHTML = appState.settings.profileImage
      ? `<img src="${appState.settings.profileImage}" alt="Teacher profile preview" />`
      : `<span>${escapeHtml(initials)}</span>`;
  }
}

init();
