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
require('dotenv').config()

var config = require('nconf');

import { join } from 'path'

let file = join(process.cwd(), 'config', 'anypay.json')

config.argv({ parseValues: true })
   .env({ parseValues: true })
   .file({ file });

config.defaults({
  'DOMAIN': 'anypayx.com',
  'PORT': '5200',
  'HOST': '127.0.0.1',
  'API_BASE': 'https://api.anypayx.com',
  'api_base': 'https://api.anypayx.com',
  'AMQP_URL': 'amqp://guest:guest@localhost:5672/',
  'DATABASE_URL': 'postgres://postgres@localhost:5432/anypay',
  'EMAIL_SENDER': 'no-reply@anypayx.com',
  'KRAKEN_PLUGIN': false,

  // Dynamic fees for BTC transactions from mempool.space
  'MEMPOOL_SPACE_FEES_ENABLED': true,

  // Send Events To Rocket Chat If Provided
  'rocketchat_webhook_url': false,

  // Enable Websockets Server and API for Wallet Bot
  'wallet_bot_app_enabled': true,

  // Optionally require a confirmation for BTC payments -- eventually this will default to true
  REQUIRE_BTC_CONFIRMATIONS: false,

  prometheus_auth_required: true,
  
  prometheus_password: '',
  
  amqp_url: process.env.AMQP_URL,

  JSONWEBTOKEN_PRIVATE_KEY_PATH: join(__dirname, '../config/jwt/jwtRS512.key'),

  JSONWEBTOKEN_PUBLIC_KEY_PATH: join(__dirname, '../config/jwt/jwtRS512.key.pub'),

  anypay_websockets_url: 'wss://wss.anypayx.com',
})

export { config } 
