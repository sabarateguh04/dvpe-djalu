import { mountLayout } from '/portal/layout.js';
import { api } from '/shared/api.js';

await mountLayout();

const params = new URLSearchParams(window.location.search);
const reporterRole = params.get('persona') || 'korban';
const content = document.getElementById('pageContent');

const categories = await api.get('/api/portal/content').then((d) => d.reportCategories).catch(() => []);

const state = { step: 0, categoryId: '', chronology: '', incidentAt: '', location: '', anonymous: reporterRole === 'anonim', contact: '' };

function render() {
  if (state.result) return renderSuccess();
  content.innerHTML = `
    <div class="dvpe-card pad">
      <div class="wizard-steps">
        ${['Kronologi', 'Detail', 'Lampiran', 'Selesai']
          .map((s, i) => `<div class="wizard-step${i <= state.step ? ' active' : ''}"><span class="wizard-step-num">${i + 1}</span> ${s}</div>`)
          .join('')}
      </div>
      <div id="stepBody"></div>
      <div id="errorBox" class="dvpe-alert dvpe-alert-error hidden" style="margin-top:12px"></div>
      <div class="wizard-nav" id="wizardNav"></div>
    </div>`;
  renderStep();
}

function renderStep() {
  const body = document.getElementById('stepBody');
  const nav = document.getElementById('wizardNav');
  if (state.step === 0) {
    body.innerHTML = `
      <div class="card-title">Pilih jenis laporan</div>
      <p class="text-muted small">Pilih kategori yang paling sesuai dengan kejadian yang Anda alami atau ketahui.</p>
      <div class="category-grid">
        ${categories.map((c) => `<button type="button" class="category-item${state.categoryId === c.id ? ' selected' : ''}" data-cat="${c.id}"><div class="category-label">${c.label}</div><div class="category-desc">${c.desc}</div></button>`).join('')}
      </div>`;
    content.querySelectorAll('[data-cat]').forEach((btn) => btn.addEventListener('click', () => { state.categoryId = btn.dataset.cat; render(); }));
    nav.innerHTML = `<span></span><button class="dvpe-btn dvpe-btn-primary" id="next0">Selanjutnya</button>`;
    document.getElementById('next0').addEventListener('click', () => {
      if (!state.categoryId) return showError('Pilih jenis laporan terlebih dahulu.');
      state.step = 1; render();
    });
  } else if (state.step === 1) {
    body.innerHTML = `
      <div class="card-title">Ceritakan Kronologi</div>
      <p class="text-muted small">Tuliskan secara singkat apa yang terjadi.</p>
      <textarea class="dvpe-textarea" id="chronology" rows="6" maxlength="2000" placeholder="Mulai ceritakan kronologi kejadian...">${state.chronology}</textarea>
      <div class="text-muted small" style="text-align:right" id="charCount">${state.chronology.length}/2000</div>
      <label class="field-label" style="margin-top:10px">Kapan kejadian terjadi? (opsional)</label>
      <input class="dvpe-input" type="date" id="incidentAt" value="${state.incidentAt}" />`;
    const ta = document.getElementById('chronology');
    ta.addEventListener('input', () => { state.chronology = ta.value; document.getElementById('charCount').textContent = `${ta.value.length}/2000`; });
    document.getElementById('incidentAt').addEventListener('input', (e) => { state.incidentAt = e.target.value; });
    nav.innerHTML = `<button class="dvpe-btn dvpe-btn-ghost" id="back1">Kembali</button><button class="dvpe-btn dvpe-btn-primary" id="next1">Selanjutnya</button>`;
    document.getElementById('back1').addEventListener('click', () => { state.step = 0; render(); });
    document.getElementById('next1').addEventListener('click', () => {
      if (state.chronology.trim().length < 10) return showError('Ceritakan kronologi minimal 10 karakter.');
      state.step = 2; render();
    });
  } else if (state.step === 2) {
    body.innerHTML = `
      <div class="card-title">Detail Tambahan</div>
      <label class="field-label">Lokasi kejadian (opsional)</label>
      <input class="dvpe-input" id="location" placeholder="Kota / Kabupaten" value="${state.location}" />
      <label class="field-label" style="margin-top:10px"><input type="checkbox" id="anonymous" ${state.anonymous ? 'checked' : ''} /> Kirim sebagai laporan anonim</label>
      <div id="contactWrap"></div>`;
    document.getElementById('location').addEventListener('input', (e) => { state.location = e.target.value; });
    function renderContact() {
      const wrap = document.getElementById('contactWrap');
      wrap.innerHTML = state.anonymous ? '' : `<label class="field-label" style="margin-top:10px">Kontak Anda (opsional)</label><input class="dvpe-input" id="contact" value="${state.contact}" />`;
      if (!state.anonymous) document.getElementById('contact').addEventListener('input', (e) => { state.contact = e.target.value; });
    }
    renderContact();
    document.getElementById('anonymous').addEventListener('change', (e) => { state.anonymous = e.target.checked; renderContact(); });
    nav.innerHTML = `<button class="dvpe-btn dvpe-btn-ghost" id="back2">Kembali</button><button class="dvpe-btn dvpe-btn-primary" id="submit2">Kirim Laporan</button>`;
    document.getElementById('back2').addEventListener('click', () => { state.step = 1; render(); });
    document.getElementById('submit2').addEventListener('click', submit);
  }
}

function showError(msg) {
  const box = document.getElementById('errorBox');
  box.textContent = msg;
  box.classList.remove('hidden');
}

async function submit() {
  const btn = document.getElementById('submit2');
  btn.disabled = true;
  btn.textContent = 'Mengirim...';
  try {
    const res = await api.post('/api/reports', {
      categoryId: state.categoryId,
      reporterRole,
      chronology: state.chronology,
      incidentAt: state.incidentAt || null,
      location: state.location || null,
      contact: state.anonymous ? null : state.contact || null,
      anonymous: state.anonymous,
    });
    state.result = res;
    render();
  } catch (err) {
    showError(err.message);
    btn.disabled = false;
    btn.textContent = 'Kirim Laporan';
  }
}

function renderSuccess() {
  content.innerHTML = `
    <div class="dvpe-card pad report-success">
      <div class="report-success-icon">✅</div>
      <h2>Laporan Berhasil Dikirim</h2>
      <p class="text-muted">${state.result.message}</p>
      <div class="report-id-box">Nomor Laporan Anda<br /><strong>${state.result.id}</strong></div>
      <p class="text-muted small">Simpan nomor ini untuk memeriksa status laporan Anda kapan saja di menu "Cek Status Laporan".</p>
    </div>`;
}

render();
