require('dotenv').config();

import {ConfigureOracles} from './oracles'

import {configureOracles} from '../config/oracles';

import * as amqp from './amqp';
import * as accounts from './accounts';
import * as login from './account_login';
import * as invoices from './invoice';
import * as forwards from './forwards';
import * as settings from './settings';
import * as prices from './prices';
import { models } from './models';
import * as cashback from './cashback';
import * as ambassadors from './ambassadors';
import * as database from './database';
import * as dashwatch from './dashwatch';
import * as addresses from './addresses';
import * as coins from './coins';
import * as xpub from './xpub';
import * as invoice from './invoice';
import { log } from './logger';
import { plugins } from './plugins';
import * as blockcypher from './blockcypher';
import * as tipjar from './tipjar';
import * as email from './email';
import * as routes from './routes';
import * as password from './password';
import * as auth from './auth';
import * as square from './square';
import * as mysql_lib from './mysql';
import * as kraken from './kraken';
import * as receipts from './receipts';
import * as settlements from './settlements';
import * as bip70 from './bip70';
import * as clicksend from './clicksend';

var oracles = ConfigureOracles(configureOracles);

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
  auth,
  bip70,
  blockcypher,
  cashback,
  clicksend,
  coins,
  dashwatch,
  database,
  email,
  forwards,
  invoices,
  kraken,
  log,
  login,
  models,
  mysql_lib,
  oracles,
  password,
  plugins,
  prices,
  receipts,
  routes,
  settings,
  settlements,
  square,
  tipjar,
  xpub
}

export async function initialize() {

  while(!initialized) {

    await amqp.wait(10);
  }

}

