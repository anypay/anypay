//console.log = function() {}

require('dotenv').config();

import * as apps from './apps';
import * as accounts from './accounts';
import * as amqp from './amqp';
import * as apikeys from './apikeys';
import * as login from './account_login';
import * as invoices from './invoice';
import * as settings from './settings';
import * as prices from './prices';
import { models } from './models';
import * as ambassadors from './ambassadors';
import * as database from './database';
import * as discount from './discount';
import * as addresses from './addresses';
import * as coins from './coins';
import * as xpub from './xpub';
import * as invoice from './invoice';
import { log } from './log';
import { plugins } from './plugins';
import * as blockcypher from './blockcypher';
import * as email from './email';
import * as password from './password';
import * as auth from './auth';
import * as receipts from './receipts';
import * as slack from './slack/notifier';
import * as events from './events';
import * as utils from './utils';
import * as pay from './pay';

var initialized = false;

(async function() {
  
  await require('../initializers').initialize();

  initialized = true;

})();

export {
  accounts,
  addresses,
  ambassadors,
  amqp,
  apikeys,
  apps,
  auth,
  blockcypher,
  coins,
  database,
  discount,
  email,
  events,
  invoices,
  log,
  login,
  models,
  password,
  pay,
  plugins,
  prices,
  receipts,
  settings,
  slack,
  utils,
  xpub
}

export async function initialize() {

  while(!initialized) {

    await amqp.wait(10);
  }

}

