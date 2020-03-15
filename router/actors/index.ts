
import * as unspent from './unspent/actor';
import * as walletnotify from './walletnotify/actor';

async function start() {

  walletnotify.start();

  unspent.start();

}

if (require.main === module) {

  start();

}

