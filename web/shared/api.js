// Thin fetch wrapper shared by the dashboard and portal SPAs. Both apps are
// served from the same origin as the API (http://localhost:4002), so plain
// relative `/api/...` paths work with no base URL/CORS configuration needed
// - this is one of the direct benefits of running everything on one port.
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
