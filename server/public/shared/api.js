// Plain fetch wrapper - loaded as a native ES module (<script type="module">),
// no bundler involved. Both apps are served from the same origin as the API
// (this same Express server), so relative /api/... paths just work.
async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(path, {
    method,
    credentials: 'include', // send the httpOnly session cookie
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no/invalid JSON body
  }

  if (!res.ok) {
    const message = (data && data.error) || `Permintaan gagal (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.details = data && data.details;
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
};

export function login(area, username, password) {
  return api.post('/api/auth/login', { area, username, password });
}

export function logout(area, username) {
  return api.post('/api/auth/logout', { area, username });
}

export function getSession() {
  return api.get('/api/auth/session');
}

export function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
