const STORAGE_KEY = 'teacher_vanessa_dashboard_state_v1';
const DEFAULT_SETTINGS = {
  teacherName: 'Vanessa',
  dashboardTitle: "Vanessa's Dashboard",
  quote: 'Add an encouraging quote for your dashboard.',
  defaultCurrency: 'PHP',
  phpRate: 58.8,
  exchangeRates: {
    PHP: 1,
    USD: 58.8,
    EUR: 63.6,
    SGD: 42.8,
    AUD: 43.1
  },
  theme: 'soft',
  font: 'serif',
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
  welcomeGreeting: document.getElementById('welcomeGreeting'),
  teacherSubtitle: document.getElementById('teacherSubtitle'),
  dashboardTitle: document.getElementById('dashboardTitle'),
  dashboardQuoteInput: document.getElementById('dashboardQuoteInput'),
  saveQuoteBtn: document.getElementById('saveQuoteBtn'),
  studentsTableBody: document.getElementById('studentsTableBody'),
  studentSearch: document.getElementById('studentSearch'),
  studentCountryFilter: document.getElementById('studentCountryFilter'),
  studentCompanyFilter: document.getElementById('studentCompanyFilter'),
  addStudentBtn: document.getElementById('addStudentBtn'),
  companyFilterBtn: document.getElementById('companyFilterBtn'),
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
  paymentsTableBody: document.getElementById('paymentsTableBody'),
  paymentStatusFilter: document.getElementById('paymentStatusFilter'),
  paymentStudentFilter: document.getElementById('paymentStudentFilter'),
  paymentFromDate: document.getElementById('paymentFromDate'),
  paymentToDate: document.getElementById('paymentToDate'),
  paymentTotalsStrip: document.getElementById('paymentTotalsStrip'),
  recordsTableBody: document.getElementById('recordsTableBody'),
  recordSearch: document.getElementById('recordSearch'),
  recordStatusFilter: document.getElementById('recordStatusFilter'),
  addRecordBtn: document.getElementById('addRecordBtn'),
  reportMonthInput: document.getElementById('reportMonthInput'),
  reportPaidValue: document.getElementById('reportPaidValue'),
  reportPendingValue: document.getElementById('reportPendingValue'),
  reportCancelledValue: document.getElementById('reportCancelledValue'),
  reportMinutesValue: document.getElementById('reportMinutesValue'),
  attendanceBars: document.getElementById('attendanceBars'),
  revenueByStudent: document.getElementById('revenueByStudent'),
  settingsForm: document.getElementById('settingsForm'),
  teacherNameInput: document.getElementById('teacherNameInput'),
  dashboardTitleInput: document.getElementById('dashboardTitleInput'),
  settingsQuoteInput: document.getElementById('settingsQuoteInput'),
  defaultCurrencyInput: document.getElementById('defaultCurrencyInput'),
  phpRateInput: document.getElementById('phpRateInput'),
  exchangeRatesInput: document.getElementById('exchangeRatesInput'),
  themeInput: document.getElementById('themeInput'),
  fontInput: document.getElementById('fontInput'),
  timezoneInput: document.getElementById('timezoneInput'),
  reminderSettingsInput: document.getElementById('reminderSettingsInput')
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
    return {
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      students: Array.isArray(parsed.students) ? parsed.students : [],
      classes: Array.isArray(parsed.classes) ? parsed.classes : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : [],
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes : [],
      schedules: Array.isArray(parsed.schedules) ? parsed.schedules : []
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
    schedules: []
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

  return {
    settings,
    students: [studentA, studentB],
    classes,
    payments,
    quotes: ['Keep showing up, one lesson at a time.'],
    schedules: []
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
  refs.companyFilterBtn.addEventListener('click', () => {
    refs.studentCompanyFilter.value = 'all';
    refs.studentCountryFilter.value = 'all';
    renderStudents();
  });

  refs.studentSearch.addEventListener('input', renderStudents);
  refs.studentCountryFilter.addEventListener('change', renderStudents);
  refs.studentCompanyFilter.addEventListener('change', renderStudents);

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

    reconcilePaymentRecords({ preserveHistoricalRate: true });
    persistState();
    closeModal(refs.studentModal);
    renderAll();
  });

  refs.classForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(refs.classForm);
    const studentId = formData.get('studentId');
    const date = String(formData.get('date') || '');
    const startTime = String(formData.get('startTime') || '');
    const duration = Number(formData.get('duration') || 0);
    const classType = String(formData.get('classType') || 'Regular');
    const attendance = String(formData.get('attendance') || 'Scheduled');
    const notes = String(formData.get('notes') || '').trim();

    if (!studentId || !date || !startTime || !duration) {
      return;
    }

    const overlap = detectOverlap({
      id: classModalEditingId,
      studentId,
      date,
      startTime,
      duration
    });

    if (overlap) {
      refs.classFormWarning.textContent = 'Warning: this class overlaps an existing class time and has not been saved.';
      refs.classFormWarning.classList.remove('hidden');
      return;
    }

    const nextClass = {
      id: classModalEditingId || generateId('class'),
      studentId,
      date,
      startTime,
      duration,
      classType,
      attendance,
      notes
    };

    if (classModalEditingId) {
      appState.classes = appState.classes.map((item) => item.id === classModalEditingId ? nextClass : item);
    } else {
      appState.classes.push(nextClass);
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
  refs.recordStatusFilter.addEventListener('change', renderClassRecords);
  refs.addRecordBtn.addEventListener('click', () => openClassModal());

  refs.reportMonthInput.addEventListener('change', renderReports);

  refs.settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    appState.settings.teacherName = refs.teacherNameInput.value.trim() || DEFAULT_SETTINGS.teacherName;
    appState.settings.dashboardTitle = refs.dashboardTitleInput.value.trim() || DEFAULT_SETTINGS.dashboardTitle;
    appState.settings.quote = refs.settingsQuoteInput.value.trim() || DEFAULT_SETTINGS.quote;
    appState.settings.defaultCurrency = refs.defaultCurrencyInput.value;
    appState.settings.phpRate = Number(refs.phpRateInput.value || DEFAULT_SETTINGS.phpRate);

    try {
      const parsedRates = JSON.parse(refs.exchangeRatesInput.value || '{}');
      appState.settings.exchangeRates = { ...DEFAULT_SETTINGS.exchangeRates, ...(parsedRates || {}) };
    } catch (_error) {
      appState.settings.exchangeRates = { ...DEFAULT_SETTINGS.exchangeRates };
    }

    appState.settings.theme = refs.themeInput.value;
    appState.settings.font = refs.fontInput.value;
    appState.settings.teacherTimezone = refs.timezoneInput.value.trim() || DEFAULT_SETTINGS.teacherTimezone;
    appState.settings.reminderSettings = refs.reminderSettingsInput.value.trim() || DEFAULT_SETTINGS.reminderSettings;

    applyTheme(appState.settings.theme);
    applyFont(appState.settings.font);
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

function renderAll() {
  renderHeader();
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
    .filter((payment) => payment.status !== 'Paid' || true)
    .reduce((sum, payment) => {
      const date = payment.classDate ? new Date(`${payment.classDate}T00:00:00`) : null;
      if (date && date >= weekRange.monday && date <= weekRange.sunday) {
        return sum + convertCurrencyValue(Number(payment.subtotal || payment.amount || 0), payment.currency, appState.settings.defaultCurrency);
      }
      return sum;
    }, 0);

  document.getElementById('weekRangeLabel').textContent = formatWeekRange(weekRange.monday, weekRange.sunday);

  const weekTotalLabel = formatCurrencyAmount(weekTotal, appState.settings.defaultCurrency);
  const summaryRows = [
    { label: 'Current Week', value: weekTotalLabel },
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
  const companyValue = refs.studentCompanyFilter.value;

  const filtered = appState.students.filter((student) => {
    const matchesText = !keyword || student.name.toLowerCase().includes(keyword);
    const matchesCountry = countryValue === 'all' || student.country === countryValue;
    const matchesCompany = companyValue === 'all' || student.company === companyValue;
    return matchesText && matchesCountry && matchesCompany;
  });

  const rows = filtered.length
    ? filtered
        .map((student) => `
          <tr class="student-row">
            <td>
              <div class="student-meta">
                <strong>${student.name}</strong>
                <span>${student.country}</span>
              </div>
            </td>
            <td>${student.company}</td>
            <td><span class="status-pill ${String(student.status || 'Active').toLowerCase()}">${student.status || 'Active'}</span></td>
            <td>
              <div class="action-buttons">
                <button type="button" class="link-btn" data-action="edit-student" data-id="${student.id}">Edit</button>
                <button type="button" class="link-btn danger" data-action="delete-student" data-id="${student.id}">Delete</button>
              </div>
            </td>
          </tr>
        `)
        .join('')
    : '<tr><td colspan="4"><div class="empty-state">No students match your filter.</div></td></tr>';

  refs.studentsTableBody.innerHTML = rows;

  refs.studentsTableBody.querySelectorAll('[data-action="edit-student"]').forEach((button) => {
    button.addEventListener('click', () => openStudentModal(button.dataset.id));
  });

  refs.studentsTableBody.querySelectorAll('[data-action="delete-student"]').forEach((button) => {
    button.addEventListener('click', () => deleteStudent(button.dataset.id));
  });

  const countries = [...new Set(appState.students.map((student) => student.country).filter(Boolean))].sort();
  const companies = [...new Set(appState.students.map((student) => student.company).filter(Boolean))].sort();

  refs.studentCountryFilter.innerHTML = ['<option value="all">All countries</option>']
    .concat(countries.map((country) => `<option value="${escapeHtml(country)}">${escapeHtml(country)}</option>`))
    .join('');

  refs.studentCompanyFilter.innerHTML = ['<option value="all">All companies</option>']
    .concat(companies.map((company) => `<option value="${escapeHtml(company)}">${escapeHtml(company)}</option>`))
    .join('');

  refs.studentCountryFilter.value = countryValue;
  refs.studentCompanyFilter.value = companyValue;
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

  const dayColumns = days
    .map((day) => {
      const dayKey = formatDateInput(day);
      const classesForDay = appState.classes.filter((item) => item.date === dayKey);
      return `
        <div class="day-column">
          <div class="day-label">${formatWeekdayShort(day)}<br><small>${formatDateShort(day)}</small></div>
          <div class="day-track">
            ${buildTimeSlots()}
            ${classesForDay
              .map((item) => {
                const top = getTimePosition(item.startTime, 7 * 60, 52);
                const height = Math.max((item.duration / 30) * 52, 54);
                const student = getStudentById(item.studentId);
                const color = item.attendance === 'Cancelled' ? 'rgba(195, 90, 90, 0.18)' : item.attendance === 'Present' ? 'rgba(115, 197, 167, 0.25)' : 'rgba(166, 214, 232, 0.22)';
                return `
                  <button type="button" class="schedule-class" data-action="edit-class" data-id="${item.id}" style="top:${top}px;height:${height}px;background:${color};">
                    <h4>${student ? student.name : 'Unknown student'}</h4>
                    <p>${item.startTime} • ${item.duration}m</p>
                    <p>${item.attendance}</p>
                  </button>
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

  refs.scheduleGrid.querySelectorAll('[data-action="edit-class"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      openClassModal(button.dataset.id);
    });
  });
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

  refs.paymentsTableBody.innerHTML = filtered.length
    ? filtered
        .map((payment) => `
          <tr class="payment-row">
            <td>${getWeekLabel(payment.weekStart || payment.classDate)}</td>
            <td>${payment.studentName}</td>
            <td>${payment.company}</td>
            <td>${payment.currency}</td>
            <td>${payment.classes || 1}</td>
            <td>${formatDisplayDate(payment.classDate)}</td>
            <td>${payment.duration} min</td>
            <td><span class="attendance-pill ${String(payment.attendance || 'Scheduled').toLowerCase()}">${payment.attendance || 'Scheduled'}</span></td>
            <td>${formatCurrencyAmount(Number(payment.rate || 0), payment.currency)}</td>
            <td>${formatCurrencyAmount(Number(payment.subtotal || payment.amount || 0), payment.currency)}</td>
            <td><span class="payment-pill ${String(payment.status || 'Pending').toLowerCase()}">${payment.status || 'Pending'}</span></td>
            <td>
              <div class="action-buttons">
                <button type="button" class="link-btn" data-action="mark-paid" data-id="${payment.id}">${payment.status === 'Paid' ? 'Paid' : 'Mark paid'}</button>
                <button type="button" class="link-btn" data-action="mark-unpaid" data-id="${payment.id}">${payment.status === 'Pending' ? 'Unpaid' : 'Mark unpaid'}</button>
              </div>
            </td>
          </tr>
        `)
        .join('')
    : '<tr><td colspan="12"><div class="empty-state">No payment records match these filters.</div></td></tr>';

  refs.paymentsTableBody.querySelectorAll('[data-action="mark-paid"]').forEach((button) => {
    button.addEventListener('click', () => setPaymentStatus(button.dataset.id, 'Paid'));
  });

  refs.paymentsTableBody.querySelectorAll('[data-action="mark-unpaid"]').forEach((button) => {
    button.addEventListener('click', () => setPaymentStatus(button.dataset.id, 'Pending'));
  });
}

function renderClassRecords() {
  const searchText = refs.recordSearch.value.trim().toLowerCase();
  const attendanceFilter = refs.recordStatusFilter.value;

  const filtered = appState.classes.filter((item) => {
    const student = getStudentById(item.studentId);
    const matchesText = !searchText || [student?.name || '', item.notes || '', item.classType, item.attendance].join(' ').toLowerCase().includes(searchText);
    const matchesStatus = attendanceFilter === 'all' || item.attendance === attendanceFilter;
    return matchesText && matchesStatus;
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
  const reportMonth = refs.reportMonthInput.value || `${new Date().getFullYear()}-${padStart(new Date().getMonth() + 1, 2, '0')}`;
  refs.reportMonthInput.value = reportMonth;

  const monthClasses = appState.classes.filter((item) => item.date.startsWith(reportMonth));
  const monthPayments = appState.payments.filter((payment) => (payment.classDate || '').startsWith(reportMonth));

  const paidTotal = monthPayments.filter((entry) => entry.status === 'Paid').reduce((sum, entry) => sum + convertCurrencyValue(Number(entry.subtotal || entry.amount || 0), entry.currency, appState.settings.defaultCurrency), 0);
  const pendingTotal = monthPayments.filter((entry) => entry.status === 'Pending').reduce((sum, entry) => sum + convertCurrencyValue(Number(entry.subtotal || entry.amount || 0), entry.currency, appState.settings.defaultCurrency), 0);
  const cancelledCount = monthClasses.filter((entry) => entry.attendance === 'Cancelled').length;
  const minutes = monthClasses.reduce((sum, entry) => sum + Number(entry.duration || 0), 0);

  refs.reportPaidValue.textContent = formatCurrencyAmount(paidTotal, appState.settings.defaultCurrency);
  refs.reportPendingValue.textContent = formatCurrencyAmount(pendingTotal, appState.settings.defaultCurrency);
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

function renderSettings() {
  refs.teacherNameInput.value = appState.settings.teacherName || DEFAULT_SETTINGS.teacherName;
  refs.dashboardTitleInput.value = appState.settings.dashboardTitle || DEFAULT_SETTINGS.dashboardTitle;
  refs.settingsQuoteInput.value = appState.settings.quote || DEFAULT_SETTINGS.quote;
  refs.defaultCurrencyInput.value = appState.settings.defaultCurrency || DEFAULT_SETTINGS.defaultCurrency;
  refs.phpRateInput.value = String(appState.settings.phpRate || DEFAULT_SETTINGS.phpRate);
  refs.exchangeRatesInput.value = JSON.stringify(appState.settings.exchangeRates || DEFAULT_SETTINGS.exchangeRates, null, 2);
  refs.themeInput.value = appState.settings.theme || DEFAULT_SETTINGS.theme;
  refs.fontInput.value = appState.settings.font || DEFAULT_SETTINGS.font;
  refs.timezoneInput.value = appState.settings.teacherTimezone || DEFAULT_SETTINGS.teacherTimezone;
  refs.reminderSettingsInput.value = appState.settings.reminderSettings || DEFAULT_SETTINGS.reminderSettings;
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

function openStudentModal(studentId = null) {
  studentModalEditingId = studentId;
  refs.studentForm.reset();
  refs.studentModalTitle.textContent = studentId ? 'Edit Student' : 'Add Student';

  if (studentId) {
    const student = appState.students.find((entry) => entry.id === studentId);
    if (!student) return;
    const entries = new FormData(refs.studentForm);
    Object.keys(Object.fromEntries(entries)).forEach(() => {});

    refs.studentForm.querySelector('[name="name"]').value = student.name || '';
    refs.studentForm.querySelector('[name="age"]').value = student.age || 0;
    refs.studentForm.querySelector('[name="company"]').value = student.company || '';
    refs.studentForm.querySelector('[name="country"]').value = student.country || '';
    refs.studentForm.querySelector('[name="timezone"]').value = student.timezone || '';
    refs.studentForm.querySelector('[name="currency"]').value = student.currency || appState.settings.defaultCurrency;
    refs.studentForm.querySelector('[name="paymentType"]').value = student.paymentType || 'Weekly';
    refs.studentForm.querySelector('[name="bookMaterial"]').value = student.bookMaterial || '';
    refs.studentForm.querySelector('[name="startDate"]').value = student.startDate || '';
    refs.studentForm.querySelector('[name="status"]').value = student.status || 'Active';
    refs.studentForm.querySelector('[name="rate25"]').value = student.rate25 || 0;
    refs.studentForm.querySelector('[name="rate50"]').value = student.rate50 || 0;
    refs.studentForm.querySelector('[name="notes"]').value = student.notes || '';
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
  classModalEditingId = null;
  studentModalEditingId = null;
}

function openClassModal(classId = null) {
  classModalEditingId = classId;
  refs.classForm.reset();
  refs.classFormWarning.classList.add('hidden');
  refs.classFormWarning.textContent = '';
  refs.classModalTitle.textContent = classId ? 'Edit Class' : 'Add Class';

  populateStaticFilters();

  const defaultDate = formatDateInput(stripTime(new Date()));
  refs.classForm.querySelector('[name="date"]').value = defaultDate;
  refs.classForm.querySelector('[name="duration"]').value = '50';
  refs.classForm.querySelector('[name="classType"]').value = 'Regular';
  refs.classForm.querySelector('[name="attendance"]').value = 'Scheduled';
  refs.classForm.querySelector('[name="startTime"]').value = '09:00';

  if (classId) {
    const currentClass = appState.classes.find((entry) => entry.id === classId);
    if (currentClass) {
      refs.classForm.querySelector('[name="studentId"]').value = currentClass.studentId || '';
      refs.classForm.querySelector('[name="date"]').value = currentClass.date || defaultDate;
      refs.classForm.querySelector('[name="startTime"]').value = currentClass.startTime || '09:00';
      refs.classForm.querySelector('[name="duration"]').value = String(currentClass.duration || 50);
      refs.classForm.querySelector('[name="classType"]').value = currentClass.classType || 'Regular';
      refs.classForm.querySelector('[name="attendance"]').value = currentClass.attendance || 'Scheduled';
      refs.classForm.querySelector('[name="notes"]').value = currentClass.notes || '';
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
  persistState();
  renderAll();
}

function setPaymentStatus(paymentId, status) {
  appState.payments = appState.payments.map((payment) => {
    if (payment.id === paymentId) {
      return { ...payment, status };
    }
    return payment;
  });
  persistState();
  renderPayments();
  renderDashboard();
  renderReports();
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
  const reconciliation = [];
  const classMap = new Map(appState.classes.map((item) => [item.id, item]));

  for (const currentClass of appState.classes) {
    const student = getStudentById(currentClass.studentId);
    if (!student) continue;

    const payable = isClassPayable(currentClass, student);
    if (!payable) {
      if (appState.payments.some((payment) => payment.classId === currentClass.id)) {
        appState.payments = appState.payments.filter((payment) => payment.classId !== currentClass.id);
      }
      continue;
    }

    const previous = appState.payments.find((payment) => payment.classId === currentClass.id);
    const rate = getRateForClass(student, currentClass.duration);
    const amount = roundMoney(Number(rate));
    const exchangeRate = getExchangeRate(student.currency || appState.settings.defaultCurrency);
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

    reconciliation.push(record);
  }

  const nextPayments = [];
  for (const record of reconciliation) {
    const previous = appState.payments.find((item) => item.classId === record.classId);
    if (previous && preserveHistoricalRate) {
      nextPayments.push({ ...previous, ...record, id: previous.id });
    } else {
      nextPayments.push(record);
    }
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
  return new Date(date).toISOString().slice(0, 10);
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
  refs.currentTime.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
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
  if (String(classItem.attendance || '').toLowerCase() === 'cancelled') return false;
  if (String(classItem.attendance || '').toLowerCase() === 'scheduled') return false;
  if (String(classItem.classType || '').toLowerCase() === 'trial') return false;
  if (String(classItem.classType || '').toLowerCase() === 'free') return false;
  if (String(classItem.attendance || '').toLowerCase() === 'absent') {
    return String(classItem.classType || '').toLowerCase() === 'regular' || String(classItem.classType || '').toLowerCase() === 'makeup';
  }
  if (String(classItem.attendance || '').toLowerCase() === 'present') {
    return String(classItem.classType || '').toLowerCase() === 'regular' || String(classItem.classType || '').toLowerCase() === 'makeup';
  }
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
  const offset = Math.max(minutes - dayStartMinutes, 0);
  return (offset / 30) * slotHeight;
}

function buildTimeSlots(includeLabels = false) {
  const startHour = 7;
  const endHour = 22;
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += 30) {
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
  const normalized = fontName === 'sans' ? 'sans' : 'serif';
  document.body.classList.toggle('font-serif', normalized === 'serif');
  document.body.classList.toggle('font-sans', normalized === 'sans');
}

init();
