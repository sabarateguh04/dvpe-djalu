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
┌──────────────────────────────────────────────────────────┐
│  Node/Express — http://localhost:4002                     │
│  ┌───────────────┐  ┌───────────────────────────────────┐ │
│  │  /api/*        │  │  plain static HTML/CSS/JS          │ │
│  │  auth, cases,  │  │  /dashboard/*  → dashboard pages   │ │
│  │  reports, ...  │  │  /portal/*     → portal pages      │ │
│  └───────────────┘  └───────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
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

**No build step, no bundler.** `dashboard/` and `portal/` are ordinary
multi-page sites — real `.html` files, real `<a href>` navigation, plain
`<script type="module">` files loaded natively by the browser (ES modules
have been supported everywhere for years; no bundler is needed to use
`import`/`export`). Express just serves the `server/public/` folder as-is.
Editing a page means editing that page's file directly — there's no compile
step between saving and reloading the browser.

### Repo layout

```
dvpe/
├── server/
│   ├── src/
│   │   ├── config/         env loading + validation
│   │   ├── middleware/      helmet/cors, auth guards, rate limits, validation
│   │   ├── routes/          auth, dashboard, portal, reports
│   │   ├── data/            in-memory seed data + stores
│   │   ├── utils/           jwt, audit log, logger
│   │   └── static.js        serves server/public/ + the page-level auth gate
│   └── public/               <- the entire frontend, plain files, no build
│       ├── shared/           theme.css, api.js (fetch wrapper) - used by both apps
│       ├── dashboard/        investigator dashboard: one .html + .js pair per page
│       └── portal/           public portal: one .html + .js pair per page
├── mobile/
│   └── dvpe_mobile/     Flutter app (public/masyarakat client)
├── ecosystem.config.js  PM2 process definition
└── package.json          root workspace scripts (dev/start)
```

## Prerequisites

- Node.js ≥ 18.18 (developed against Node 24) and npm
- For the mobile app: Flutter SDK (developed against a recent stable
  release) with Android/iOS toolchains as needed
- Windows/macOS/Linux all fine for the server; mobile builds follow normal
  Flutter platform requirements

## Install

```bash
git clone https://github.com/sabarateguh04/dvpe-djalu.git
cd dvpe-djalu
npm install
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

## Run

```bash
npm run dev     # NODE_ENV=development, nodemon (auto-restarts on file changes)
# or
npm start       # NODE_ENV=production
```

Both do the exact same thing (start `server/src/index.js`) - the only
difference is auto-restart-on-change and a couple of security headers that
only make sense once you're actually behind HTTPS (see **Security notes**).
Open:

- **http://localhost:4002/dashboard** — login `admin` / `admin`
- **http://localhost:4002/portal** — login `portal` / `portal`

Since there's no build step, editing any file under `server/public/` takes
effect on the next browser refresh - no separate process to restart.

## Running with PM2

> Deploying to a fresh server? **[DEPLOY.md](./DEPLOY.md)** is the
> straight-through, copy-paste version of this section: clone → install →
> configure → `pm2 start` → survive-a-reboot.

[PM2](https://pm2.keymetrics.io/) keeps `dvpe-server` running, restarts it on
crash, and can bring it back up on machine reboot. A `logs/` folder is
created next to `server/` for its output.

```bash
npm install -g pm2      # once, globally
npm install               # project deps (see Install above)
cp server/.env.example server/.env   # then edit JWT_SECRET etc.

pm2 start ecosystem.config.js
pm2 status               # confirm "dvpe-server" is online
pm2 logs dvpe-server      # tail logs
```

Useful follow-ups:

```bash
pm2 restart dvpe-server   # after `git pull`-ing new code
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
- **Sessions**: httpOnly, `SameSite=Strict` cookies; `Secure` (HTTPS-only)
  once `HTTPS_ENABLED` is on (see `.env.example` - defaults to on whenever
  `NODE_ENV=production`). Two independent cookies
  (`dvpe_dashboard_session`, `dvpe_portal_session`) enforce the
  dashboard/portal role split.
- **Page-level auth gate**: `server/src/static.js` checks the session cookie
  server-side before serving any `/dashboard/*.html` or `/portal/*.html`
  page (except each area's own `login.html`) and redirects to login if it's
  missing/invalid — the gate lives in the server, not just client-side
  JavaScript. Static assets (css/js/images) are always served regardless,
  since they carry no sensitive data themselves; the real case/report data
  is behind `/api/*`, which has its own independent auth check on every
  request.
- **CSRF**: mitigated primarily by `SameSite=Strict` — there are no
  state-changing `GET` routes, and the only cookie-authenticated writes are
  same-site fetches from our own pages.
- **Headers & CSP**: `helmet` with a real, strict `Content-Security-Policy`
  in production - notably **no `'unsafe-inline'` on `script-src`**, which is
  exactly why every page's JS lives in an external `.js` file rather than an
  inline `<script>` block (inline scripts would be silently blocked by that
  policy).
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
- **Fail-fast config**: the server refuses to start in production with a
  missing, placeholder, or short `JWT_SECRET`.
- **`HTTPS_ENABLED`**: independent from `NODE_ENV`, controls the
  Secure-cookie flag and the CSP's `upgrade-insecure-requests`/HSTS/COOP
  headers. Needed because a production deployment doesn't necessarily have
  TLS in front of it yet (e.g. testing directly on `http://<server-ip>:4002`
  before DNS/certs exist) - see the comment block in `server/.env.example`
  and `DEPLOY.md` for when to set this to `false`.

None of this is a substitute for the full RBAC/consent/anonymization model
described in the proposal — it's what's appropriate for this mockup's scope.

## Known limitations

- Data (cases, submitted reports, audit log) is **in-memory** — it resets
  whenever the server restarts. There is no real database yet.
- Several dashboard/portal sidebar items are intentionally placeholder
  screens (e.g. Case Triage, Bukti Digital, e-Penyidikan, Tanya Alesha AI) —
  the navigation exists to show the intended information architecture, but
  the screens themselves aren't built out yet.
- The "Peta Kerawanan" map is a real Indonesia outline (pre-generated from
  public Natural Earth data, baked into `dashboard/indonesiaMapData.js`)
  with illustrative hotspot markers, not a live GIS integration.
- The demo dashboard/portal logins are a preview-stage gate only, not the
  real per-user RBAC model from the proposal.
