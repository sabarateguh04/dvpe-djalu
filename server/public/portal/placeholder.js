import { mountLayout } from '/portal/layout.js';

await mountLayout();
const params = new URLSearchParams(window.location.search);
document.getElementById('ph-title').textContent = params.get('title') || 'Halaman';
document.title = `${params.get('title') || 'Halaman'} - DVPE Portal`;
