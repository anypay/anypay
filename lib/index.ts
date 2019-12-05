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


var oracles = ConfigureOracles(configureOracles);

var initialized = false;

(async function() {
  
  await require('../initializers').initialize();

  initialized = true;

})();

export {
  oracles,
  amqp,
  cashback,
  models,
  accounts,
  settings,
  prices,
  forwards,
  ambassadors,
  log,
  database,
  dashwatch,
  coins,
  addresses,
  plugins,
  invoices,
  xpub,
  blockcypher,
  tipjar,
  email,
  routes,
  password,
  login,
  auth
}

export async function initialize() {

  while(!initialized) {

    await amqp.wait(10);
  }

}


