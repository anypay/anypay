
require('dotenv').config()

var config = require('nconf');

import { join } from 'path'

let file = join(process.cwd(), 'config', 'anypay.json')

config.argv({ parseValues: true })
   .env({ parseValues: true })
   .file({ file });

config.defaults({
  'DOMAIN': 'api.anypayx.com',
  'PORT': '5200',
  'HOST': '127.0.0.1',
  'API_BASE': 'https://api.anypayx.com',
  'AMQP_URL': 'amqp://guest:guest@localhost:5672/',
  'DATABASE_URL': 'postgres://postgres@localhost:5432/anypay',
  'EMAIL_SENDER': 'support@anypayx.com',
  'KRAKEN_PLUGIN': false,

  // Dynamic fees for BTC transactions from mempool.space
  'mempool_space_fees_enabled': true,

  // Send Events To Rocket Chat If Provided
  'rocketchat_webhook_url': false,

  // Enable Websockets Server and API for Wallet Bot
  'wallet_bot_app_enabled': true
})

export { config } 

