// PM2 process definition for the DVPE server.
//
// The web frontend (dashboard + portal) is a static build, not a running
// process - PM2 only needs to manage the Node/Express API + static server
// on port 4002. Build the frontend once before first start, and again
// after any frontend change (PM2 doesn't build anything itself):
//
//   npm install
//   npm run build
//   pm2 start ecosystem.config.js
//
// See README.md "Menjalankan dengan PM2" for the full walkthrough.
module.exports = {
  apps: [
    {
      name: 'dvpe-server',
      script: 'src/index.js',
      cwd: './server', // so dotenv picks up server/.env, and static.js resolves ../../web/dist correctly
      interpreter: 'node',
      exec_mode: 'fork', // single instance: in-memory demo data/session store isn't shared across cluster workers
      instances: 1,
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '300M',
      autorestart: true,
      watch: false,
      out_file: '../logs/dvpe-server.out.log',
      error_file: '../logs/dvpe-server.error.log',
      time: true,
    },
  ],
};
