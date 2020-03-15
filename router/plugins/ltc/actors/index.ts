
import * as server from './server/actor';
import * as unspent from './unspent/actor';
import * as walletnotify from './walletnotify/actor';

async function start() {

  server.start();

  walletnotify.start();

  unspent.start();

}

if (require.main === module) {

  start();

}

