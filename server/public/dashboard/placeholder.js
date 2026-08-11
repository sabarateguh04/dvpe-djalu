import { mountLayout } from '/dashboard/layout.js';

await mountLayout();
const params = new URLSearchParams(window.location.search);
document.getElementById('ph-title').textContent = params.get('title') || 'Modul';
document.title = `${params.get('title') || 'Modul'} - DVPE Dashboard`;
