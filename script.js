// ===== GLOBAL STATE =====
let currentSection = 'ch0';
let systemQuizScore = 0;
let systemQuizAnswered = 0;
const totalSystemQuiz = 4;
let currentGDPTab = 'growth';

// ===== DATA =====
const inflationData = {
  1990: 9.5, 1991: 9.4, 1992: 4.9, 1993: 5.9, 1994: 6.6,
  1995: 8.1, 1996: 6.5, 1997: 6.8, 1998: 77.6, 1999: 20.1,
  2000: 6.4, 2001: 5.4, 2002: 5.1, 2003: 6.4, 2004: 6.1,
  2005: 10.5, 2006: 6.6, 2007: 6.4, 2008: 9.8, 2009: 4.8,
  2010: 5.1, 2011: 5.4, 2012: 4.3, 2013: 8.4, 2014: 8.4,
  2015: 6.4, 2016: 3.0, 2017: 3.6, 2018: 3.2, 2019: 2.7,
  2020: 2.0, 2021: 2.6, 2022: 5.5, 2023: 2.6
};

const gdpData = {
  years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
  growth: [4.88, 5.02, 5.07, 5.17, 5.02, -2.07, 3.69, 5.31, 5.05],
  gdp: [12.4, 13.3, 14.3, 15.3, 16.2, 15.4, 16.7, 18.5, 20.0],
  percapita: [47.8, 51.0, 54.2, 57.4, 60.1, 57.2, 61.8, 67.9, 73.0]
};

const gdpLabels = { growth: 'Pertumbuhan Ekonomi (%)', gdp: 'GDP (Triliun Rp)', percapita: 'PDB Per Kapita (Juta Rp)' };

// ===== NAVIGATION =====
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function updateNavigation() {
  const sections = document.querySelectorAll('.section[id]');
  const scrollPos = window.scrollY + window.innerHeight / 2;
  let activeId = 'ch0';
  sections.forEach(section => {
    if (section.offsetTop <= scrollPos) activeId = section.id;
  });
  const dots = document.querySelectorAll('.dot-nav a');
  dots.forEach(dot => {
    dot.classList.remove('active');
    if (dot.getAttribute('data-section') === activeId || dot.getAttribute('href') === '#' + activeId) {
      dot.classList.add('active');
    }
  });
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / docHeight) * 100;
  document.getElementById('progressBar').style.width = progress + '%';
  currentSection = activeId;
  try { localStorage.setItem('ekolearn_progress', activeId); } catch(e) {}
  document.querySelectorAll('.section-transition').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) el.classList.add('visible');
  });
}

function applyParallax() {
  if (window.innerWidth < 768) return;
  const scrollY = window.scrollY;
  document.querySelectorAll('.section-bg-pattern svg').forEach(el => {
    el.style.transform = `translateY(${scrollY * 0.3}px)`;
  });
}

window.addEventListener('scroll', () => {
  requestAnimationFrame(() => { updateNavigation(); applyParallax(); });
});

document.querySelectorAll('.dot-nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== CHAPTER 0: Budget =====
function updateBudget() {
  const makan = parseInt(document.getElementById('sliderMakan').value);
  const transport = parseInt(document.getElementById('sliderTransport').value);
  const hiburan = parseInt(document.getElementById('sliderHiburan').value);
  const tabungan = parseInt(document.getElementById('sliderTabungan').value);
  const lainnya = parseInt(document.getElementById('sliderLainnya').value);
  document.getElementById('valMakan').textContent = makan.toLocaleString('id-ID');
  document.getElementById('valTransport').textContent = transport.toLocaleString('id-ID');
  document.getElementById('valHiburan').textContent = hiburan.toLocaleString('id-ID');
  document.getElementById('valTabungan').textContent = tabungan.toLocaleString('id-ID');
  document.getElementById('valLainnya').textContent = lainnya.toLocaleString('id-ID');
  const total = makan + transport + hiburan + tabungan + lainnya;
  const remaining = 50000 - total;
  document.getElementById('budgetRemaining').textContent = 'Rp' + remaining.toLocaleString('id-ID');
  document.getElementById('budgetRemaining').style.color = remaining < 0 ? 'var(--coral)' : 'var(--dark)';
}

function analyzeBudget() {
  const makan = parseInt(document.getElementById('sliderMakan').value);
  const hiburan = parseInt(document.getElementById('sliderHiburan').value);
  const tabungan = parseInt(document.getElementById('sliderTabungan').value);
  const total = makan + parseInt(document.getElementById('sliderTransport').value) + hiburan + tabungan + parseInt(document.getElementById('sliderLainnya').value);
  if (total > 50000) {
    document.getElementById('budgetFeedbackText').textContent = '⚠️ Budgetmu melebihi Rp50.000! Ini pelajaran pertama tentang kelangkaan — sumber daya terbatas!';
    document.getElementById('budgetFeedback').style.display = 'block';
    return;
  }
  let feedback = '';
  if (tabungan >= 15000) feedback = '🌟 Excellent! Menabung 30%+ itu kebiasaan finansial yang kuat! ';
  else if (tabungan >= 10000) feedback = '👍 Bagus! Menabung 20% sudah baik. Coba tingkatkan lagi! ';
  else if (tabungan > 0) feedback = '😊 Lumayan, masih menabung meski sedikit. Setiap rupiah penting! ';
  else feedback = '⚠️ Kamu tidak menabung! Ingat: menabung bukan soal sisa belanja, tapi belanja dari sisa menabung. ';
  if (hiburan > 20000) feedback += '🎮 40%+ untuk hiburan — hati-hati dengan hedonic treadmill!';
  document.getElementById('budgetFeedbackText').textContent = feedback;
  document.getElementById('budgetFeedback').style.display = 'block';
}

// ===== CHAPTER 1: Resource Allocation =====
function updateResourceAlloc() {
  const k = parseInt(document.getElementById('sliderKesehatan').value);
  const p = parseInt(document.getElementById('sliderPendidikan').value);
  const i = parseInt(document.getElementById('sliderInfrastruktur').value);
  const pe = parseInt(document.getElementById('sliderPertahanan').value);
  const pt = parseInt(document.getElementById('sliderPertanian').value);
  document.getElementById('valKesehatan').textContent = k;
  document.getElementById('valPendidikan').textContent = p;
  document.getElementById('valInfrastruktur').textContent = i;
  document.getElementById('valPertahanan').textContent = pe;
  document.getElementById('valPertanian').textContent = pt;
  const total = k + p + i + pe + pt;
  document.getElementById('resourceTotal').textContent = total;
  const status = document.getElementById('resourceStatus');
  if (total > 1000) { status.textContent = '(⚠️ Melebihi budget!)'; status.style.color = 'var(--coral)'; }
  else if (total === 1000) { status.textContent = '(✅ Sesuai budget)'; status.style.color = 'var(--green)'; }
  else { status.textContent = '(sisa: ' + (1000 - total) + ' M)'; status.style.color = '#888'; }
  const maxK = 400, maxP = 400, maxI = 350, maxPe = 250, maxPt = 300;
  document.getElementById('gaugeKesehatan').style.width = Math.min((k / maxK) * 100, 100) + '%';
  document.getElementById('gaugeLabelKesehatan').textContent = Math.min(Math.round((k / maxK) * 100), 100) + '%';
  document.getElementById('gaugePendidikan').style.width = Math.min((p / maxP) * 100, 100) + '%';
  document.getElementById('gaugeLabelPendidikan').textContent = Math.min(Math.round((p / maxP) * 100), 100) + '%';
  document.getElementById('gaugeInfrastruktur').style.width = Math.min((i / maxI) * 100, 100) + '%';
  document.getElementById('gaugeLabelInfrastruktur').textContent = Math.min(Math.round((i / maxI) * 100), 100) + '%';
  document.getElementById('gaugePertahanan').style.width = Math.min((pe / maxPe) * 100, 100) + '%';
  document.getElementById('gaugeLabelPertahanan').textContent = Math.min(Math.round((pe / maxPe) * 100), 100) + '%';
  document.getElementById('gaugePertanian').style.width = Math.min((pt / maxPt) * 100, 100) + '%';
  document.getElementById('gaugeLabelPertanian').textContent = Math.min(Math.round((pt / maxPt) * 100), 100) + '%';
}

// ===== CHAPTER 2: Trader Game =====
function updateTraderGame() {
  const harga = parseInt(document.getElementById('sliderGameHarga').value);
  document.getElementById('gameHarga').textContent = harga.toLocaleString('id-ID');
  
  const selisihKenaikan = (harga - 15000) / 1000;
  
  // Logika Permintaan Baru: Maksimal 60 orang saat harga termurah.
  // Setiap harga naik Rp1.000, pembeli berkurang sekitar 0.68 orang.
  const buyers = Math.max(2, Math.round(60 - (selisihKenaikan * 0.68)));
  
  // Logika Penjualan: Stok sekarang 60kg
  const sold = Math.min(buyers, 60);
  
  const revenue = sold * harga;
  const cost = sold * 15000;
  const profit = revenue - cost;
  
  document.getElementById('gameBuyers').textContent = buyers;
  document.getElementById('gameSold').textContent = sold;
  document.getElementById('gameRevenue').textContent = revenue.toLocaleString('id-ID');
  document.getElementById('gameProfit').textContent = profit.toLocaleString('id-ID');
  
  const area = document.getElementById('gameBuyerArea');
  area.innerHTML = '';
  
  for (let i = 0; i < buyers; i++) {
    const buyer = document.createElement('span');
    buyer.className = 'game-buyer';
    buyer.textContent = '👤';
    buyer.style.animationDelay = (i * 0.02) + 's'; 
    area.appendChild(buyer);
  }
  
  // Indikator sisa stok dari 60kg
  if (sold < 60) {
    const unsold = document.createElement('span');
    unsold.style.color = '#888';
    unsold.style.fontSize = '1.2rem';
    unsold.style.display = 'inline-block';
    unsold.style.marginLeft = '10px';
    unsold.textContent = ' 📦×' + (60 - sold) + ' (tidak laku)';
    area.appendChild(unsold);
  }
}

// ===== CHAPTER 3: Price Simulation =====
function updatePriceSim() {
  const price = parseInt(document.getElementById('sliderPriceMarket').value);
  document.getElementById('priceMarket').textContent = price.toLocaleString('id-ID');
  const demand = Math.max(0, Math.round(150 - price / 1000));
  const supply = Math.max(0, Math.round(price / 1000 - 10));
  document.getElementById('simDemand').textContent = demand;
  document.getElementById('simSupply').textContent = supply;
  const statusEl = document.getElementById('simStatus');
  if (demand > supply) { statusEl.textContent = '📉 Shortage (' + (demand - supply) + ' unit)'; statusEl.style.color = 'var(--coral)'; }
  else if (supply > demand) { statusEl.textContent = '📈 Surplus (' + (supply - demand) + ' unit)'; statusEl.style.color = 'var(--teal)'; }
  else { statusEl.textContent = '⚖️ Seimbang'; statusEl.style.color = 'var(--dark)'; }
  const maxPrice = 140000;
  const cs = Math.max(0, Math.round((maxPrice - price) * demand * 0.5));
  const ps = Math.max(0, Math.round((price - 10000) * supply * 0.5));
  document.getElementById('simConsumerSurplus').textContent = cs.toLocaleString('id-ID');
  document.getElementById('simProducerSurplus').textContent = ps.toLocaleString('id-ID');
  const priceY = 260 - ((price - 10000) / (maxPrice - 10000)) * 220;
  document.getElementById('priceLine').setAttribute('y1', priceY);
  document.getElementById('priceLine').setAttribute('y2', priceY);
  document.getElementById('priceLabel').setAttribute('y', priceY + 5);
}

// ===== CHAPTER 4: Inflation Machine =====
function updateInflationMachine() {
  const nominal = parseInt(document.getElementById('sliderMachineNominal').value);
  const year = parseInt(document.getElementById('sliderMachineYear').value);
  document.getElementById('machineNominal').textContent = nominal.toLocaleString('id-ID');
  document.getElementById('machineYear').textContent = year;
  let cumulativeMultiplier = 1;
  for (let y = year; y < 2024; y++) {
    if (inflationData[y]) cumulativeMultiplier *= (1 + inflationData[y] / 100);
  }
  const equivalent = Math.round(nominal * cumulativeMultiplier);
  const inflationPercent = Math.round((cumulativeMultiplier - 1) * 100);
  const purchasingPower = Math.round((1 - 1 / cumulativeMultiplier) * 1000) / 10;
  document.getElementById('machineResult').textContent = equivalent.toLocaleString('id-ID');
  document.getElementById('machineInput').textContent = nominal.toLocaleString('id-ID');
  document.getElementById('machineYearFrom').textContent = year;
  document.getElementById('machineEquivalent').textContent = equivalent.toLocaleString('id-ID');
  document.getElementById('machineInflation').textContent = inflationPercent.toLocaleString('id-ID');
  document.getElementById('machineLoss').textContent = purchasingPower.toLocaleString('id-ID');
}

// ===== CHAPTER 5: System Quiz =====
const systemQuizAnswers = { 1: 'kapitalis', 2: 'sosialis', 3: 'campuran', 4: 'sosialis' };
const systemQuizExplanations = {
  1: '✅ Benar! Pasar bebas tanpa intervensi pemerintah adalah ciri utama kapitalisme.',
  2: '✅ Benar! Kontrol penuh pemerintah atas produksi adalah ciri sistem sosialis.',
  3: '✅ Benar! Kombinasi pasar bebas + regulasi pemerintah adalah ciri ekonomi campuran.',
  4: '✅ Benar! Layanan publik gratis dari pajak tinggi adalah ciri sosialisme.'
};
const wrongExplanations = {
  1: '❌ Kurang tepat. Pasar bebas tanpa intervensi adalah ciri KAPITALISME.',
  2: '❌ Kurang tepat. Kontrol penuh pemerintah atas produksi adalah ciri SOSIALISME.',
  3: '❌ Kurang tepat. Kombinasi pasar bebas + regulasi pemerintah adalah ciri EKONOMI CAMPURAN.',
  4: '❌ Kurang tepat. Layanan publik gratis dari pajak tinggi adalah ciri SOSIALISME.'
};

function checkSystemQuiz(num, answer) {
  const card = document.getElementById('quizCard' + num);
  const feedback = document.getElementById('feedback' + num);
  const buttons = card.querySelectorAll('.btn');
  buttons.forEach(btn => { btn.style.pointerEvents = 'none'; btn.style.opacity = '0.6'; });
  systemQuizAnswered++;
  if (answer === systemQuizAnswers[num]) {
    systemQuizScore++;
    feedback.textContent = systemQuizExplanations[num];
    feedback.style.background = 'var(--green)'; feedback.style.color = '#fff';
  } else {
    feedback.textContent = wrongExplanations[num];
    feedback.style.background = '#FED7D7'; feedback.style.color = 'var(--dark)';
  }
  feedback.classList.add('show');
  if (systemQuizAnswered === totalSystemQuiz) {
    const scoreEl = document.getElementById('systemQuizScore');
    scoreEl.style.display = 'block';
    document.getElementById('systemQuizScoreVal').textContent = systemQuizScore;
    let msg = '';
    if (systemQuizScore === 4) msg = ' Sempurna! Kamu memahami sistem ekonomi dengan sangat baik!';
    else if (systemQuizScore >= 3) msg = '👍 Hebat! Pemahamanmu sudah bagus!';
    else if (systemQuizScore >= 2) msg = '😊 Lumayan! Coba pelajari lagi materi di atas.';
    else msg = '📚 Kamu perlu membaca ulang materi. Jangan menyerah!';
    document.getElementById('systemQuizMessage').textContent = msg;
  }
}
// ===== FUNGSI RESET KUIS =====
function resetSystemQuiz() {
  // 1. Kembalikan variabel skor dan progres ke 0
  systemQuizScore = 0;
  systemQuizAnswered = 0;

  // 2. Sembunyikan card hasil akhir
  const scoreEl = document.getElementById('systemQuizScore');
  scoreEl.style.display = 'none';

  // 3. Reset tampilan setiap soal (1 sampai 4)
  for (let num = 1; num <= 4; num++) {
    const card = document.getElementById('quizCard' + num);
    const feedback = document.getElementById('feedback' + num);
    const buttons = card.querySelectorAll('.btn');

    // Sembunyikan dan bersihkan kotak feedback
    feedback.classList.remove('show');
    feedback.textContent = '';
    feedback.style.background = ''; 
    feedback.style.color = '';

    // Aktifkan kembali semua tombol
    buttons.forEach(btn => {
      btn.style.pointerEvents = 'auto'; // Bisa diklik lagi
      btn.style.opacity = '1';          // Warnanya terang lagi
    });
  }
}
// ===== CHAPTER 6: GDP Chart =====
function switchGDPTab(tab, event) {
  currentGDPTab = tab;
  document.querySelectorAll('.tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
  if (event) event.target.classList.add('active');
  renderGDPChart();
  document.getElementById('gdpDetailTitle').textContent = ' Data ' + gdpLabels[tab];
  document.getElementById('gdpDetailText').textContent = 'Sentuh atau klik batang grafik di atas untuk melihat detail per tahun.';
}

function renderGDPChart() {
  const container = document.getElementById('gdpChartContainer');
  if (!container) return;

  const cw = Math.max(container.clientWidth, 550);
  const ch = Math.max(container.clientHeight, 300);

  const data = gdpData[currentGDPTab];
  const years = gdpData.years;
  
  const maxVal = Math.max(...data) * 1.15;
  const minVal = Math.min(...data);
  const range = maxVal - (minVal < 0 ? minVal : 0); 
  const chartHeight = ch - 80;
  const barWidth = Math.max(20, Math.min(50, (cw - 100) / years.length - 10));

  const colors = ['var(--coral)', 'var(--teal)', 'var(--purple)', 'var(--green)', 'var(--blue)', 'var(--coral)', 'var(--teal)', 'var(--purple)', 'var(--green)'];

  let html = `<svg width="${cw}" height="${ch}" style="display:block" xmlns="http://www.w3.org/2000/svg">`;

  const zeroY = 30 + (maxVal / range * chartHeight);

  // 1. Grid lines & Teks Sumbu Y (Angka di samping)
  for (let i = 0; i <= 4; i++) {
    const y = 30 + chartHeight * (1 - i / 4);
    const val = (minVal < 0 ? (minVal + (range * i / 4)) : (range * i / 4));
    html += `<line x1="50" y1="${y}" x2="${cw - 30}" y2="${y}" stroke="#E0E0E0" stroke-width="1" stroke-dasharray="4,4"/>`;
    
    // PERUBAHAN: font-size diperbesar (12), ditambah font-family, dan posisi y disesuaikan
    html += `<text x="40" y="${y + 4}" text-anchor="end" font-size="12" font-family="'Noto Sans', sans-serif" font-weight="600" fill="#333">${Math.round(val * 10) / 10}</text>`;
  }

  // Zero line
  if (minVal < 0) {
    html += `<line x1="50" y1="${zeroY}" x2="${cw - 30}" y2="${zeroY}" stroke="#1A1A2E" stroke-width="2"/>`;
  }

  // Bars & Teks Sumbu X (Tahun di bawah)
  years.forEach((year, i) => {
    const val = data[i];
    const barHeight = Math.max(2, Math.abs(val) / range * chartHeight);
    const isNegative = val < 0;

    const x = 60 + i * ((cw - 100) / years.length);
    const y = isNegative ? zeroY : (zeroY - barHeight);
    const barColor = isNegative ? 'rgba(255,107,107,0.8)' : colors[i % colors.length];

    html += `<rect
      x="${x}" y="${y}" width="${barWidth}" height="${barHeight}"
      rx="4"
      fill="${barColor}"
      stroke="#1A1A2E" stroke-width="2"
      data-year="${year}" data-value="${val}"
      onmouseenter="showGDPTooltip(event, ${year}, ${val})"
      onmouseleave="hideGDPTooltip()"
      onclick="showGDPDetail(${year}, ${val})"
      style="cursor:pointer; transition: all 0.3s ease;"/>`;

    // PERUBAHAN: font-size diperbesar (13), font-family ditambahkan, dan posisi y diangkat sedikit agar tidak terpotong
    html += `<text x="${x + barWidth / 2}" y="${ch - 30}" text-anchor="middle" font-size="13" font-family="'Noto Sans', sans-serif" font-weight="700" fill="#1A1A2E">${year}</text>`;
  });

  html += `</svg>`;
  container.innerHTML = html;
}

function showGDPTooltip(event, year, value) {
  const tooltip = document.getElementById('gdpTooltip');
  const unit = currentGDPTab === 'growth' ? '%' : (currentGDPTab === 'gdp' ? 'T' : 'Jt');
  
  tooltip.innerHTML = `<strong>${year}</strong>: ${value}${unit}`;
  const wrapper = tooltip.closest('.section-inner');
  const rect = wrapper.getBoundingClientRect();
  
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  tooltip.style.left = (mouseX + 15) + 'px';
  tooltip.style.top = (mouseY - 40) + 'px';
  
  tooltip.classList.add('show');
}

function hideGDPTooltip() {
  document.getElementById('gdpTooltip').classList.remove('show');
}

function showGDPDetail(year, value) {
  let text = '';
  switch(currentGDPTab) {
    case 'growth':
      text = `Tahun ${year}: Pertumbuhan ekonomi Indonesia sebesar ${value}%.`;
      if (year === 2020) text += '  Tahun pandemi COVID-19, ekonomi mengalami kontraksi pertama kali dalam beberapa dekade.';
      else if (year === 2022) text += ' 🚀 Pemulihan pasca-pandemi, pertumbuhan tertinggi sejak 2013!';
      else if (value > 5) text += ' 📈 Pertumbuhan di atas 5% menunjukkan ekonomi yang sehat.';
      else if (value < 3) text += '  Pertumbuhan melambat, biasanya akibat faktor internal atau global.';
      break;
    case 'gdp':
      text = `Tahun ${year}: GDP Indonesia mencapai Rp${value} triliun.`;
      if (year === 2023) text += ' 🏆 GDP tertinggi sepanjang sejarah Indonesia!';
      break;
    case 'percapita':
      text = `Tahun ${year}: PDB per kapita Indonesia Rp${value} juta.`;
      if (value > 65) text += ' 🌟 Indonesia mendekati status upper-middle income country!';
      break;
  }
  document.getElementById('gdpDetailText').textContent = text;
}

// ===== CHAPTER 7: Policy Simulator =====
function updatePolicySim() {
  const rate = parseFloat(document.getElementById('sliderPolicyRate').value);
  const govt = parseInt(document.getElementById('sliderPolicyGovt').value);
  document.getElementById('policyRate').textContent = rate.toFixed(2);
  document.getElementById('policyGovt').textContent = govt;
}

function runPolicySim() {
  const rate = parseFloat(document.getElementById('sliderPolicyRate').value);
  const govt = parseInt(document.getElementById('sliderPolicyGovt').value);
  const inflation = Math.max(0.5, Math.round((2 + (govt / 10) - (rate * 0.5)) * 10) / 10);
  const investment = Math.max(10, Math.round(80 - rate * 4 + govt * 0.3));
  const growth = Math.max(-2, Math.round((5 + (govt - 50) * 0.05 - (rate - 5) * 0.4) * 10) / 10);
  const exchange = Math.max(12000, Math.round(15000 + (rate - 5) * -500 + (govt - 50) * 30));

  document.getElementById('gaugeInflation').style.width = Math.min(inflation / 10 * 100, 100) + '%';
  document.getElementById('gaugeLabelInflation').textContent = inflation.toFixed(1) + '%';
  document.getElementById('gaugeInvestment').style.width = investment + '%';
  document.getElementById('gaugeLabelInvestment').textContent = investment + '%';
  document.getElementById('gaugeGrowth').style.width = Math.max(0, (growth + 2) / 10 * 100) + '%';
  document.getElementById('gaugeLabelGrowth').textContent = growth.toFixed(1) + '%';
  document.getElementById('gaugeExchange').style.width = Math.max(0, (exchange - 12000) / 6000 * 100) + '%';
  document.getElementById('gaugeLabelExchange').textContent = exchange.toLocaleString('id-ID');

  let feedback = '';
  if (rate < 3) feedback = '📉 Suku bunga sangat rendah! Investasi meningkat, tapi inflasi bisa melonjak. ';
  else if (rate > 10) feedback = ' Suku bunga sangat tinggi! Inflasi terkendali, tapi investasi terhambat. ';
  else feedback = '✅ Suku bunga moderat — posisi seimbang. ';
  if (govt > 70) feedback += '🏛️ Belanja pemerintah sangat tinggi, tapi berisiko meningkatkan utang negara. ';
  else if (govt < 30) feedback += '🏛️ Belanja pemerintah rendah. Fiskal sehat, tapi pertumbuhan mungkin lambat. ';
  if (inflation > 6) feedback += ' ⚠️ Inflasi di atas 6% — mengkhawatirkan!';
  if (growth > 6) feedback += '  Pertumbuhan di atas 6% — ekonomi berkembang pesat!';
  document.getElementById('policyFeedbackText').textContent = feedback;
  document.getElementById('policyFeedback').style.display = 'block';
}

// ===== SLIDE NAVIGATION =====

// 1. Fungsi saat Dot diklik (Klik dot langsung geser)
function scrollToSlide(containerId, index) {
  const container = document.getElementById(containerId);
  const itemWidth = container.querySelector('.slide-item').offsetWidth + 24; // lebar card + gap 24px
  
  container.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
}

// 2. Fungsi untuk Tombol Panah (Kiri/Kanan)
function moveSlide(containerId, direction) {
  const container = document.getElementById(containerId);
  const itemWidth = container.querySelector('.slide-item').offsetWidth + 24;
  
  container.scrollBy({ left: itemWidth * direction, behavior: 'smooth' });
}

// 3. Update Dot Otomatis saat di-Slide / Swipe
document.querySelectorAll('.slide-container').forEach(container => {
  container.addEventListener('scroll', () => {
    // Otomatis mencari id indikator (Contoh: dari 'slideCh1' jadi 'slideIndCh1')
    const indicatorId = container.id.replace('slide', 'slideInd');
    const indicator = document.getElementById(indicatorId);
    
    if (indicator) {
      const dots = indicator.querySelectorAll('.slide-dot');
      const itemWidth = container.querySelector('.slide-item').offsetWidth + 24;
      
      // Hitung index yang sedang aktif berdasarkan posisi scroll
      const activeIndex = Math.round(container.scrollLeft / itemWidth);
      
      // Pindahkan class 'active' ke dot yang sesuai
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
      });
    }
  });
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  updateTraderGame();
  updateBudget();
  updateResourceAlloc();
  updateInflationMachine();
  updatePriceSim();
  updatePolicySim();
  updateNavigation();

  // Delay chart render until layout is ready
  requestAnimationFrame(() => {
    setTimeout(() => {
      renderGDPChart();
    }, 150);
  });

  // Trigger initial visibility
  document.querySelectorAll('.section-transition').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) el.classList.add('visible');
  });
});

let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    renderGDPChart();
    updateTraderGame();
  }, 250);
});
