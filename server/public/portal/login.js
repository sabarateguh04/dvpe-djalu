import { login } from '/shared/api.js';

const params = new URLSearchParams(window.location.search);
const from = params.get('from') || '/portal/';

const form = document.getElementById('loginForm');
const errorBox = document.getElementById('errorBox');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.classList.add('hidden');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Memproses...';
  try {
    await login('portal', document.getElementById('username').value, document.getElementById('password').value);
    window.location.href = from;
  } catch (err) {
    errorBox.textContent = err.message || 'Login gagal.';
    errorBox.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Masuk';
  }
});
