require('dotenv').config();

import * as server from './server/actor';
import * as unspent from './unspent/actor';
import * as dust from './dust/actor';
import * as walletnotify from './walletnotify/actor';

async function start() {

  server.start();

  unspent.start();

  walletnotify.start();

  dust.start();

}

if (require.main === module) {

  start();

}

