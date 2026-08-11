import { mountLayout } from '/portal/layout.js';
import { api } from '/shared/api.js';

await mountLayout();

const form = document.getElementById('form');
const errorBox = document.getElementById('errorBox');
const resultBox = document.getElementById('resultBox');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.classList.add('hidden');
  resultBox.classList.add('hidden');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Memeriksa...';
  try {
    const id = document.getElementById('reportId').value.trim();
    const res = await api.get(`/api/reports/${encodeURIComponent(id)}/status`);
    resultBox.innerHTML = `<div><strong>${res.id}</strong> &bull; ${res.category}</div><div>Status: <strong>${res.status}</strong></div><div class="text-muted small">Dilaporkan: ${new Date(res.createdAt).toLocaleString('id-ID')}</div>`;
    resultBox.classList.remove('hidden');
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Cek Status';
  }
});
