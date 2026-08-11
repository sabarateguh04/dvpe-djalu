# DVPE — Digital Victim Protection Ecosystem (Mockup)

Clickable initial mockup of DVPE — a platform for digitalizing the handling of
violence against women & children and human trafficking cases, based on the
`DVP System Executive Proposal`. This build focuses on the **dashboard**
(internal, for investigators/case workers) and the **portal** (public-facing
reporting site), plus a matching **mobile** client, all talking to a single
backend API.

> ⚠️ **This is a mockup**, not the production system described in the
> proposal. Data is in-memory (resets on server restart), the two web apps
> sit behind demo credentials instead of the real RBAC model, and several
> sidebar/nav items are placeholder screens. See **Known limitations**
> below.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Node/Express API  —  http://localhost:4002              │
│  ┌───────────────┐  ┌──────────────────────────────────┐ │
│  │  /api/*        │  │  static frontend (built by Vite) │ │
│  │  auth, cases,  │  │  /dashboard/*  → dashboard SPA    │ │
│  │  reports, ...  │  │  /portal/*     → portal SPA       │ │
│  └───────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                     ▲
                     │ HTTP (port 4002)
                     │
        ┌────────────┴────────────┐
        │   Flutter mobile app    │
        │  (masyarakat / public)  │
        └──────────────────────────┘
```

Everything — the API, the investigator **dashboard**, and the public
**portal** — is served from **one port, 4002**, split by path:

- `/dashboard` — investigator/case-worker dashboard (login: `admin` / `admin`)
- `/portal` — public reporting portal preview (login: `portal` / `portal`)
- `/api/*` — the backend both web apps and the mobile app call

The demo logins exist only because this is an early, otherwise-internal
preview build being shared before the real system goes live — in the actual
product the portal is public with no login. See `server/.env.example` for
where to change them, and **Security notes** below for why they're safe to
ship this way.

In **development**, a Vite dev server (hot reload) runs on an internal
loopback port and the API process transparently proxies non-`/api` requests
to it — so the browser still only ever talks to port 4002. In
**production**, the API process serves the pre-built static files directly;
there is no separate frontend server/port at all.

### Repo layout

```
dvpe/
├── server/            Node/Express API (ESM)
│   └── src/
│       ├── config/        env loading + validation
│       ├── middleware/     helmet/cors, auth guards, rate limits, validation
│       ├── routes/         auth, dashboard, portal, reports
│       ├── data/           in-memory seed data + stores
│       └── utils/          jwt, audit log, logger
├── web/
│   ├── dashboard/      investigator dashboard (React + Vite)
│   ├── portal/         public portal (React + Vite)
│   ├── shared/         code shared by both SPAs (api client, theme.css, ErrorBoundary)
│   └── scripts/        one-off build-time asset generators (e.g. the Indonesia map path)
├── mobile/
│   └── dvpe_mobile/    Flutter app (public/masyarakat client)
├── ecosystem.config.js PM2 process definition
└── package.json         root workspace scripts (dev/build/start)
```

## Prerequisites

- Node.js ≥ 18.18 (developed against Node 24) and npm
- For the mobile app: Flutter SDK (developed against a recent stable
  release) with Android/iOS toolchains as needed
- Windows/macOS/Linux all fine for the server + web; mobile builds follow
  normal Flutter platform requirements

## Install

```bash
git clone https://github.com/sabarateguh04/dvpe-djalu.git
cd dvpe-djalu
npm install          # installs root + server + web workspaces together
```

The mobile app has its own dependency set:

```bash
cd mobile/dvpe_mobile
flutter pub get
```

## Configure

```bash
cp server/.env.example server/.env
```

Open `server/.env` and, at minimum for anything beyond localhost, replace
`JWT_SECRET` with a long random value (the server refuses to boot in
production with the placeholder). Everything else has a working default.
See the comments in `server/.env.example` for what each variable does.

## Run — development (hot reload)

```bash
npm run dev
```

This starts the Vite dev server and the API together and prints the URLs.
Open:

- **http://localhost:4002/dashboard** — login `admin` / `admin`
- **http://localhost:4002/portal** — login `portal` / `portal`

Everything is on port 4002 as described above — there is no separate `:5173`
to visit.

## Run — production build

```bash
npm run build        # builds both SPAs into web/dist
npm run start:nobuild # starts the API against that build (or `npm start` to build+start in one step)
```

Then open the same two URLs. Production mode also enforces `Secure` session
cookies, which require HTTPS — put a reverse proxy (nginx, Caddy, etc.)
terminating TLS in front of port 4002 for any non-localhost deployment.

## Running with PM2

[PM2](https://pm2.keymetrics.io/) keeps `dvpe-server` running, restarts it on
crash, and can bring it back up on machine reboot. A `logs/` folder is
created next to `server/` for its output.

```bash
npm install -g pm2      # once, globally
npm install              # project deps (see Install above)
cp server/.env.example server/.env   # then edit JWT_SECRET etc.
npm run build            # build the frontend - PM2 does not do this for you

pm2 start ecosystem.config.js
pm2 status               # confirm "dvpe-server" is online
pm2 logs dvpe-server      # tail logs
```

Useful follow-ups:

```bash
pm2 restart dvpe-server   # after pulling new server code or re-running `npm run build`
pm2 stop dvpe-server
pm2 delete dvpe-server

pm2 startup               # prints an OS-specific command to enable "start on boot" - run what it prints
pm2 save                  # snapshot the current process list so it's restored after reboot/`pm2 resurrect`
```

`ecosystem.config.js` runs a single fork-mode instance deliberately — the
mockup's case/report/audit data lives in an in-memory array (see **Known
limitations**), so PM2 cluster mode (multiple workers) would show different,
inconsistent data per request depending on which worker handled it. Don't
switch it to cluster mode without first moving that state into a real
shared store (Postgres/Redis/etc).

## Mobile app

```bash
cd mobile/dvpe_mobile
flutter pub get
flutter run   # pick a device/emulator when prompted
```

The app calls the same backend on port 4002. Base URL resolution
(`lib/config.dart`) already handles the Android-emulator-vs-`localhost`
quirk; for a physical device or a backend on another machine, pass:

```bash
flutter run --dart-define=DVPE_API_BASE_URL=http://<your-lan-ip>:4002
```

The mobile app talks to the same public, unauthenticated `/api/reports` and
`/api/panic` endpoints the portal's report wizard uses — no login required,
matching how a real victim/witness would use it (see `reports.routes.js`).

## Security notes

This mockup takes security seriously even though it's an early-stage UI
preview:

- **Passwords**: hashed with bcrypt at boot, even for the well-known demo
  credentials — the app never compares/stores plaintext.
- **Brute-force protection**: per-IP rate limiting (`express-rate-limit`) on
  `/api/auth/login`, plus a separate per-account lockout after 5 failed
  attempts, independent of the attacker's IP.
- **Sessions**: httpOnly, `SameSite=Strict` cookies; `Secure` (HTTPS-only) in
  production. Two independent cookies (`dvpe_dashboard_session`,
  `dvpe_portal_session`) enforce the dashboard/portal role split.
- **CSRF**: mitigated primarily by `SameSite=Strict` — there are no
  state-changing `GET` routes, and the only cookie-authenticated writes are
  same-site fetches from our own SPA.
- **Headers**: `helmet` with a real CSP in production (relaxed only in dev,
  where Vite's HMR client needs it).
- **Input validation**: every request body is validated with `zod` before
  it touches any handler logic.
- **Rate limiting on public endpoints**: `/api/reports`, `/api/reports/:id/status`,
  and `/api/panic` are intentionally unauthenticated (matching how victims/
  witnesses actually use the real system) but rate-limited, and report IDs
  are random rather than sequential to prevent enumeration.
- **Audit trail**: every login, report submission, and panic trigger is
  recorded in a hash-chained, tamper-evident (in-memory) audit log, visible
  at Dashboard → Administrasi → Audit Log — a small illustration of the
  proposal's "Immutable Audit Trail" concept.
- **Caching**: HTML entry points are served `Cache-Control: no-cache` so a
  fresh deploy is never masked by a stale cached page; hashed JS/CSS assets
  are `immutable` and cached for a year (safe, since their filename changes
  whenever their content does).
- **Fail-fast config**: the server refuses to start in production with a
  missing, placeholder, or short `JWT_SECRET`.

None of this is a substitute for the full RBAC/consent/anonymization model
described in the proposal — it's what's appropriate for this mockup's scope.

## Known limitations

- Data (cases, submitted reports, audit log) is **in-memory** — it resets
  whenever the server restarts. There is no real database yet.
- Several dashboard/portal sidebar items are intentionally placeholder
  screens (e.g. Case Triage, Bukti Digital, e-Penyidikan, Tanya Alesha AI) —
  the navigation exists to show the intended information architecture, but
  the screens themselves aren't built out yet.
- The "Peta Kerawanan" map is a real Indonesia outline (generated at build
  time from public Natural Earth data) with illustrative hotspot markers,
  not a live GIS integration.
- The demo dashboard/portal logins are a preview-stage gate only, not the
  real per-user RBAC model from the proposal.
