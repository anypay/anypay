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

import { config } from '@/lib/config'
import * as apps from '@/lib/apps';
import * as accounts from '@/lib/accounts';
import * as amqp from '@/lib/amqp';
import * as apikeys from '@/lib/apikeys';
import * as blockchair from '@/lib/blockchair';
import * as blockcypher from '@/lib/blockcypher';
import * as chain_so from '@/lib/chain_so';
import * as login from '@/lib/account_login';
import * as invoices from '@/lib/invoice';
import * as settings from '@/lib/settings';
import * as prices from '@/lib/prices'; 
import * as addresses from '@/lib/addresses';
import * as coins from '@/lib/coins';
import { log } from '@/lib/log';
import { plugins } from '@/lib/plugins';
import * as password from '@/lib/password';
import * as auth from '@/lib/auth';
import * as events from '@/lib/events';
import * as utils from '@/lib/utils';
import * as pay from '@/lib/pay';
import * as access from '@/lib/access_tokens';
import * as mempool from '@/lib/mempool.space'
import * as nownodes from '@/lib/nownodes'

import {
  payment_options as PaymentOption,
} from '@prisma/client'

import { Transaction } from '@/lib/plugin'

var initialized = false;

const anypay = {
  log,
}

export default anypay

;(async function() {

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

