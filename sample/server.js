/*
  If you plan to run AGC on Kubernetes at some point
  in the future, avoid changing the environment variable names below as
  each one has a specific meaning within Asyngular.
*/

// TODO 2: Use init volume instead of using fsutil.js and dockerwait.js.

const path = require('path');
const emtase = require('emtase');
const chokidar = require('chokidar');

const ENVIRONMENT = process.env.ENV || 'dev';
const ASYNGULAR_WORKER_CONTROLLER = process.env.ASYNGULAR_WORKER_CONTROLLER || path.join(__dirname, 'worker.js');

if (ENVIRONMENT === 'dev') {
  // This will cause the process to reboot when code changes anywhere in the app directory.
  console.log(`   !! Chokidar is watching for code changes in the ${__dirname} directory`);

  let chokidarOptions = {
    cwd: __dirname,
    ignored: ['public', 'node_modules', 'README.md', 'Dockerfile', 'server.js', 'broker.js', /[\/\\]\./, '*.log']
  };
  let chokidarWatcher = emtase(chokidar.watch('.', chokidarOptions));

  (async () => {
    let [filePath] = await chokidarWatcher.listener('change').once();
    console.log(`   !! File ${filePath} was modified. Restarting worker...`);
    process.exit(0);
  })();
}

require(ASYNGULAR_WORKER_CONTROLLER);
