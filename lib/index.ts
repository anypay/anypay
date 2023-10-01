
require('dotenv').config();

import { config } from './config'
import * as apps from './apps';
import { App } from './apps'
import * as accounts from './accounts';
import { Account } from './account'
import * as amqp from './amqp';
import * as apikeys from './apikeys';
import * as blockchair from './blockchair';
import * as blockcypher from './blockcypher';
import * as chain_so from './chain_so';
import * as login from './account_login';
import * as invoices from './invoice';
import { Invoice } from './invoices'
import * as settings from './settings';
import * as prices from './prices';
import * as database from './database';
import * as addresses from './addresses';
import * as coins from './coins';
import { log } from './log';
import { plugins } from './plugins';
import * as password from './password';
import * as auth from './auth';
import * as slack from './slack/notifier';
import * as events from './events';
import * as utils from './utils';
import * as pay from './pay';
import * as access from './access_tokens';
import { AccessToken } from './access_tokens'
import * as mempool from './mempool.space'
import * as nownodes from './nownodes'
import { Payment } from './payments'
import { PaymentOption } from './payment_option'
import * as orm from './orm'
import { prisma } from './prisma'

export { prisma } 

import { Transaction } from './plugin'

var initialized = false;

import * as initializers from '../initializers'

export interface Anypay {
  log:           any;
  orm:           any;
  App:           any;
  AccessToken:   any;
  Account:       any;
  Invoice:       any;
  Payment:       any;
  PaymentOption: any;
}

const anypay = {
  log,
  orm: orm,
  Account: Account,
  AccessToken: AccessToken,
  App: App,
  Invoice: Invoice,
  Payment: Payment,
  PaymentOption: PaymentOption
}

export default anypay

;(async function() {

  await initializers.initialize(anypay);

  initialized = true;

})();

export {
  access,
  accounts,
  addresses,
  amqp,
  apikeys,
  apps,
  auth,
  blockchair,
  blockcypher,
  chain_so,
  coins,
  config,
  database,
  events,
  invoices,
  log,
  login,
  nownodes,
  password,
  pay,
  plugins,
  prices,
  settings,
  slack,
  utils,
  mempool,
  PaymentOption,
  Transaction
}

export async function initialize() {

  while(!initialized) {

    await amqp.wait(10);
  }

}

