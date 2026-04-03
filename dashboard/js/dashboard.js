/* ── dashboard/js/dashboard.js ── */

// ─── Sidebar toggle ───────────────────────────────────────
const sidebar      = document.getElementById('sidebar');
const hamburger    = document.getElementById('hamburger');
const sidebarClose = document.getElementById('sidebar-close');

hamburger?.addEventListener('click', () => sidebar.classList.toggle('open'));
sidebarClose?.addEventListener('click', () => sidebar.classList.remove('open'));
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// ─── Theme toggle ─────────────────────────────────────────
const themeBtn = document.getElementById('theme-toggle');
themeBtn?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

// ─── Chart tabs ───────────────────────────────────────────
document.querySelectorAll('.chart-tab').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.chart-tab').forEach(b => b.classList.remove('chart-tab--active'));
    this.classList.add('chart-tab--active');
    animateChart();
  });
});

// ─── Animate main chart ───────────────────────────────────
const CHART_PATHS = {
  '1D': 'M0 200 C40 185,80 195,120 175 C160 155,200 170,240 155 C280 140,320 160,360 140 C400 120,440 135,480 115 C520 95,560 110,600 90 C640 70,680 85,720 65 C760 45,800 50,800 50',
  '1W': 'M0 210 C40 195,80 180,120 170 C160 160,200 185,240 165 C280 145,320 120,360 105 C400 90,440 115,480 95 C520 75,560 60,600 45 C640 30,680 50,720 38 C760 26,800 30,800 30',
  '1M': 'M0 220 C40 210,80 205,120 190 C160 175,200 165,240 155 C280 145,320 125,360 108 C400 91,440 100,480 82 C520 64,560 55,600 40 C640 25,680 35,720 22 C760 9,800 15,800 15',
  '3M': 'M0 240 C40 230,80 220,120 205 C160 190,200 175,240 158 C280 141,320 125,360 108 C400 91,440 78,480 60 C520 42,560 30,600 18 C640 6,680 12,720 5 C760 2,800 8,800 8',
  '1Y': 'M0 255 C40 248,80 240,120 225 C160 210,200 195,240 175 C280 155,320 135,360 115 C400 95,440 80,480 60 C520 40,560 25,600 12 C640 3,680 8,720 3 C760 1,800 5,800 5',
};

function animateChart() {
  const activeTab = document.querySelector('.chart-tab--active')?.textContent?.trim() || '1W';
  const line = document.getElementById('chart-line');
  const area = document.getElementById('chart-area');
  if (!line || !area) return;

  const linePath = CHART_PATHS[activeTab] || CHART_PATHS['1W'];
  const areaPath = linePath + ' L800 260 L0 260 Z';

  line.setAttribute('d', linePath);
  area.setAttribute('d', areaPath);
}

// ─── Live price simulation ────────────────────────────────
const PRICES = {
  btc: 67412.80,
  eth:  3541.20,
  sol:   178.45,
  bnb:   602.30,
  uni:     9.82,
};

function randomWalk(value, volatility = 0.0015) {
  const delta = value * volatility * (Math.random() - 0.5) * 2;
  return parseFloat((value + delta).toFixed(2));
}

function formatPrice(val) {
  if (val >= 1000) return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (val >= 1)    return '$' + val.toFixed(2);
  return '$' + val.toFixed(4);
}

function tickPrices() {
  for (const [id, oldVal] of Object.entries(PRICES)) {
    const newVal = randomWalk(oldVal);
    const el = document.querySelector(`[data-id="${id}"]`);
    if (!el) { PRICES[id] = newVal; continue; }

    const prev = PRICES[id];
    PRICES[id] = newVal;
    el.textContent = formatPrice(newVal);

    el.style.color = newVal >= prev ? 'var(--green)' : 'var(--red)';
    setTimeout(() => { el.style.color = ''; }, 700);
  }
}

setInterval(tickPrices, 2200);

// ─── Gas price simulation ─────────────────────────────────
let gasPrice = 24;
const gasEl = document.getElementById('gas-price');

function tickGas() {
  gasPrice = Math.max(10, Math.min(80, gasPrice + Math.floor(Math.random() * 5 - 2)));
  if (gasEl) gasEl.textContent = `${gasPrice} Gwei`;
}
setInterval(tickGas, 3500);

// ─── Filter buttons ───────────────────────────────────────
document.querySelectorAll('.assets-filter .filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    this.closest('.assets-filter').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
    this.classList.add('filter-btn--active');
  });
});

document.querySelectorAll('.market-tabs .filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    this.closest('.market-tabs').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
    this.classList.add('filter-btn--active');
  });
});

// ─── Swap flip animation ──────────────────────────────────
document.getElementById('swap-flip')?.addEventListener('click', function () {
  this.style.transform = 'rotate(180deg)';
  setTimeout(() => { this.style.transform = ''; }, 400);
});

// ─── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  animateChart();
});
