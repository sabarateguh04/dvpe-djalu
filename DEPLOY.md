# Deploy DVPE to a server (PM2, port 4002)

Straight-through steps to get a fresh server running this app on port 4002
under PM2. For architecture/security background see `README.md` — this file
is just the copy-paste path.

There is **no build step** — the frontend is plain HTML/CSS/JS served
directly, so this is shorter than a typical Node app deploy: clone, install,
configure, start.

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

**If you're accessing this directly over `http://<ip>:4002` (no TLS/reverse
proxy in front yet)**, also add:

```
HTTPS_ENABLED=false
```

Without this, `NODE_ENV=production` assumes HTTPS is in front of it: the
session cookie gets marked `Secure` (browsers then refuse to send it back
over plain HTTP - login silently "does nothing"), and the CSP forces every
page's JS to load over `https://`, which doesn't exist yet - the page loads
with a correct `<title>` but a **blank white body**, since the scripts
never actually load. Once you do put TLS in front (see the note at the
bottom of this file), remove this line again.

## 4. Start with PM2

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

## 5. Make it survive a reboot

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
pm2 restart dvpe-server     # after `git pull`-ing new server code
pm2 stop dvpe-server
pm2 delete dvpe-server
pm2 monit                    # live CPU/memory
```

## Updating to a newer commit later

```bash
cd dvpe-djalu
git pull
npm install          # only needed if package.json changed
pm2 restart dvpe-server
```

No build/compile step to remember — since `server/public/*.html` and `*.js`
are plain files served as-is, a `git pull` alone is enough for any frontend
change to take effect on the next `pm2 restart`.

## Troubleshooting: it's not reachable from outside the server

Work through these in order - each one has ruled out a real issue during
this app's own deployment before:

1. **Is the process actually running and listening?**
   ```bash
   pm2 status
   curl -i http://127.0.0.1:4002/api/health
   ```
2. **Is it bound to all interfaces, not just localhost?**
   ```bash
   ss -tlnp | grep 4002
   ```
   Want to see `0.0.0.0:4002` / `*:4002`, not `127.0.0.1:4002`.
3. **Check the OS firewall directly** (a control panel's "open port" toggle
   doesn't always mean what you think):
   ```bash
   sudo ufw status verbose        # Ubuntu/Debian
   sudo firewall-cmd --list-all   # CentOS/AlmaLinux etc.
   ```
   If **both** `ufw` and `firewalld` are active on the same box (happens
   more than you'd expect on panel-managed servers like aaPanel), the port
   needs to be allowed in **both**, not just one.
4. **Your cloud provider's security group** — a separate layer outside the
   OS entirely (AWS/Alibaba Cloud/Tencent Cloud/DigitalOcean/etc. all have
   one, usually called "Security Group" or "Firewall Rules" in their
   console). Opening the port in `ufw`/`firewalld` does nothing here; it
   needs its own explicit rule for TCP 4002.
5. **More than one process/clone on the same port.** If you've deployed
   this more than once on the same server (e.g. a leftover clone from an
   earlier attempt), only one process can actually hold port 4002 -
   whichever bound first "wins" and keeps serving old code indefinitely,
   no matter how many times you `git pull` and restart the *other* one.
   Confirm which one you're actually talking to:
   ```bash
   PID=$(ss -tlnp | grep 4002 | grep -oP 'pid=\K[0-9]+')
   readlink /proc/$PID/cwd   # does this match the folder you're editing?
   ```

## Note on HTTPS / reverse proxy

Once `HTTPS_ENABLED=true` (the default whenever `NODE_ENV=production`),
session cookies are marked `Secure`, which browsers only send over HTTPS.
Running plain `http://<server>:4002` directly (with `HTTPS_ENABLED=false`,
per step 3) works for quick testing, but for anything real, put nginx/Caddy/
Traefik in front terminating TLS and proxying to `127.0.0.1:4002`, remove
that `HTTPS_ENABLED=false` line, and open only 443 externally. Minimal
nginx example:

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
