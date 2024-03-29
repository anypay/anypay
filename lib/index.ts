/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

require('dotenv').config();

import { config } from './config'
import * as apps from './apps';
import * as accounts from './accounts';
import * as amqp from './amqp';
import * as apikeys from './apikeys';
import * as blockchair from './blockchair';
import * as blockcypher from './blockcypher';
import * as chain_so from './chain_so';
import * as login from './account_login';
import * as invoices from './invoice';
import * as settings from './settings';
import * as prices from './prices'; 
import * as addresses from './addresses';
import * as coins from './coins';
import { log } from './log';
import { plugins } from './plugins';
import * as password from './password';
import * as auth from './auth';
import * as events from './events';
import * as utils from './utils';
import * as pay from './pay';
import * as access from './access_tokens';
import * as mempool from './mempool.space'
import * as nownodes from './nownodes'

import {
  payment_options as PaymentOption,
} from '@prisma/client'

import { Transaction } from './plugin'

var initialized = false;

import * as initializers from '../initializers'

const anypay = {
  log,
}

export default anypay

;(async function() {

  await initializers.initialize();

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

