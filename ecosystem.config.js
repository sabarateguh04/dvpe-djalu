// PM2 process definition for the DVPE server.
//
// The frontend (dashboard + portal, under server/public/) is plain static
// HTML/CSS/JS with no build step - PM2 only needs to manage the one Node
// process, which serves both the API and those files directly:
//
//   npm install
//   pm2 start ecosystem.config.js
//
// See README.md "Running with PM2" (or DEPLOY.md for the full server
// walkthrough) for more.
module.exports = {
  apps: [
    {
      name: 'dvpe-server',
      script: 'src/index.js',
      cwd: './server', // so dotenv picks up server/.env, and static.js resolves ../public correctly
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
