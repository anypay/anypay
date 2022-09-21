
require('dotenv').config();

import { config } from './config'
import * as apps from './apps';
import * as accounts from './accounts';
import * as amqp from './amqp';
import * as apikeys from './apikeys';
import * as blockchair from './blockchair';
import * as blockchain from './blockchain';
import * as blockcypher from './blockcypher';
import * as login from './account_login';
import * as invoices from './invoice';
import * as settings from './settings';
import * as prices from './prices';
import { models } from './models';
import * as database from './database';
import * as addresses from './addresses';
import * as coins from './coins';
import { log } from './log';
import { plugins } from './plugins';
import * as email from './email';
import * as password from './password';
import * as auth from './auth';
import * as slack from './slack/notifier';
import * as events from './events';
import * as utils from './utils';
import * as pay from './pay';
import * as mempool from './mempool.space'


var initialized = false;

(async function() {

  await require('../initializers').initialize();

  initialized = true;

})();

export {
  accounts,
  addresses,
  amqp,
  apikeys,
  apps,
  auth,
  blockchair,
  blockchain,
  blockcypher,
  coins,
  config,
  database,
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
  settings,
  slack,
  utils,
  mempool
}

export async function initialize() {

  while(!initialized) {

    await amqp.wait(10);
  }

}

