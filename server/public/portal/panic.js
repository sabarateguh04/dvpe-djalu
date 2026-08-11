import { mountLayout } from '/portal/layout.js';
import { api } from '/shared/api.js';

await mountLayout();

const area = document.getElementById('area');

function showTrigger() {
  area.innerHTML = `<button class="dvpe-btn dvpe-btn-danger" id="btnTrigger" style="padding:14px 30px;font-size:15px">🆘 Aktifkan Panic Button</button>`;
  document.getElementById('btnTrigger').addEventListener('click', showConfirm);
}

function showConfirm() {
  area.innerHTML = `
    <div class="dvpe-alert dvpe-alert-warn" style="max-width:420px;margin:0 auto">
      <p>Anda akan mengirim sinyal darurat ke tim respons. Lanjutkan?</p>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:10px">
        <button class="dvpe-btn dvpe-btn-ghost" id="btnCancel">Batal</button>
        <button class="dvpe-btn dvpe-btn-danger" id="btnConfirm">Ya, Kirim Sinyal</button>
      </div>
    </div>`;
  document.getElementById('btnCancel').addEventListener('click', showTrigger);
  document.getElementById('btnConfirm').addEventListener('click', trigger);
}

document.getElementById('btnTrigger').addEventListener('click', showConfirm);

async function trigger() {
  const btn = document.getElementById('btnConfirm');
  btn.disabled = true;
  btn.textContent = 'Mengirim...';
  try {
    const res = await api.post('/api/panic', {});
    area.innerHTML = `
      <div class="dvpe-alert dvpe-alert-info" style="max-width:420px;margin:0 auto">
        <p>${res.message}</p>
        <p>Hotline 24 jam: <strong>${res.hotline}</strong></p>
      </div>`;
  } catch (err) {
    area.innerHTML = `<div class="dvpe-alert dvpe-alert-error">${err.message}</div>`;
  }
}
