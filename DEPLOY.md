# Deploy DVPE to a server (PM2, port 4002)

Straight-through steps to get a fresh server running this app on port 4002
under PM2. For architecture/security background see `README.md` — this file
is just the copy-paste path.

## 0. Prerequisites (once per server)

```bash
node -v     # need >= 18.18 - if missing/older, install Node LTS first
npm -v
npm install -g pm2
```

## 1. Clone

```bash
git clone https://github.com/sabarateguh04/dvpe-djalu.git
cd dvpe-djalu
```

## 2. Install dependencies

```bash
npm install
```

(This installs the root, `server/`, and `web/` workspaces together in one
step.)

## 3. Configure

```bash
cp server/.env.example server/.env
```

Generate a real secret and put it in `server/.env` — **the server refuses
to start in production without this**:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Open `server/.env` and set:

```
NODE_ENV=production
PORT=4002
JWT_SECRET=<paste the generated value here>
```

Leave `CORS_ORIGINS`, the demo login vars, etc. as-is unless you have a
reason to change them — see the comments in `server/.env.example`.

> ⚠️ If this server is reachable by anyone other than you, rotate
> `DASHBOARD_DEMO_USER`/`_PASS` and `PORTAL_DEMO_USER`/`_PASS` away from
> `admin`/`admin` and `portal`/`portal` before exposing it.

## 4. Build the frontend

```bash
npm run build
```

This builds both SPAs into `web/dist/`. The server serves this directly —
PM2 does not build anything for you, so **re-run this after every future
`git pull`** that touches `web/`, then `pm2 restart dvpe-server`.

## 5. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 status
```

You should see `dvpe-server` listed as `online`. Check it's actually
answering:

```bash
curl -i http://localhost:4002/api/health
# {"ok":true,"env":"production"}
```

Then visit (replace with your server's address if not local):

- `http://<server>:4002/dashboard` — login `admin` / `admin`
- `http://<server>:4002/portal` — login `portal` / `portal`

If the server has a firewall, open port 4002 (or, better, put a reverse
proxy with TLS in front of it and only expose 443 — see the note at the
bottom).

## 6. Make it survive a reboot

```bash
pm2 save          # snapshots the current process list
pm2 startup        # prints an OS-specific command
```

`pm2 startup` doesn't do anything by itself — it prints a command tailored
to your OS/init system (systemd, etc.). **Copy that printed command and run
it** (usually needs `sudo`). After that, `pm2 save` will make `dvpe-server`
come back automatically on reboot.

## Everyday operations

```bash
pm2 logs dvpe-server        # tail logs
pm2 restart dvpe-server     # after `git pull` + `npm install` + `npm run build`
pm2 stop dvpe-server
pm2 delete dvpe-server
pm2 monit                    # live CPU/memory
```

## Updating to a newer commit later

```bash
cd dvpe-djalu
git pull
npm install          # only needed if package.json changed
npm run build
pm2 restart dvpe-server
```

## Note on HTTPS / reverse proxy

In production (`NODE_ENV=production`), session cookies are marked `Secure`,
which browsers only send over HTTPS. Running plain `http://<server>:4002`
directly works for quick testing, but for anything real, put nginx/Caddy/
Traefik in front terminating TLS and proxying to `127.0.0.1:4002`, then
open only 443 externally. Minimal nginx example:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.example;
    # ssl_certificate / ssl_certificate_key ...

    location / {
        proxy_pass http://127.0.0.1:4002;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`server/src/index.js` already has `app.set('trust proxy', 1)`, so it will
correctly see the real client IP (for rate limiting) through a proxy like
this.
