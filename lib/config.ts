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

import config from 'nconf'

import { join } from 'path'

let file = join(process.cwd(), 'config', 'anypay.json')

export const allowedVariables: EnvironmentVariable[] = []
const variablesMap: {
  [key: string]: EnvironmentVariable
} = {}

interface EnvironmentVariable {
  key: string;
  required: boolean;
  default?: string | boolean | number;
  type?: 'string' | 'boolean' | 'integer' | 'decimal'
}

export function registerEnvironmentVariable(variable: EnvironmentVariable) {
  allowedVariables.push(variable)
  variablesMap[variable.key] = variable
}

const variables: EnvironmentVariable[] = [
  {
    key: 'DOMAIN',
    default: 'anypayx.com',
    required: false
  },
  {
    key: 'ANYPAY_AMQP_EXCHANGE',
    required: false,
    default: 'anypay'
  }, {
    key: 'AMQP_URL',
    required: true
  }, {    
    key: 'HOST',
    required: false,
    default: '0.0.0.0'
  },
  {
    key: 'PORT',
    required: false,
    default: '5200'
  },
  {
    key: 'WEBSOCKETS_PORT',
    required: false,
    default: '5201'
  },
  {
    key: 'WEBSOCKETS_HOST',
    required: false,
    default: '0.0.0.0'
  },
  {
    key: 'NODE_ENV',
    required: true,
    default: 'development'
  },
  {
    key: 'DATABASE_URL',
    required: true
  },
  {
    key: 'API_BASE',
    required: false,
    default: 'https://api.anypayx.com'
  },
  {
    key: 'X509_DOMAIN_CERT_DER_PATH',
    required: false
  },
  {
    key: 'X509_PRIVATE_KEY_PATH',
    required: false
  },
  {
    key: 'X509_ROOT_CERT_DER_PATH',
    required: false
  },
  {
    key: 'FIREBASE_SERVER_KEY',
    required: false
  },
  {
    key: 'SENTRY_DSN',
    required: false
  },
  {
    key: 'LOKI_ENABLED',
    required: false,
    default: 'false'
  },
  {
    key: 'LOKI_HOST',
    required: false
  },
  {
    key: 'LOKI_LABEL_APP',
    required: false,
    default: 'anypay'
  },
  {
    key: 'LOKI_BASIC_AUTH',
    required: false
  },
  {
    key: 'KRAKEN_AUTOSELL_INTERVAL',
    required: false
  },
  {
    key: 'KRAKEN_WITHDRAWAL_KEY',
    required: false
  },
  {
    key: 'ANYPAY_FIXER_ACCESS_KEY',
    required: false
  },
  {
    key: 'ANYPAY_SLACK_CHANNEL_URL',
    required: false
  },
  {
    key: 'ROCKETCHAT_WEBHOOK_URL',
    required: false
  },
  {
    // Dynamic fees for BTC transactions from mempool.space
    key: 'MEMPOOL_SPACE_FEES_ENABLED',
    required: false,
    default: 'true'
  },
  {
    key: 'KRAKEN_PLUGIN',
    required: false,
    default: false,
    type: 'boolean'
  },
  {
    key: 'ANYPAY_WEBSOCKETS_URL',
    required: false,
    default: 'wss://wss.anypayx.com'
  },
  {
    key: 'JSONWEBTOKEN_PUBLIC_KEY_PATH',
    required: false,
    default: join(__dirname, '../config/jwt/jwtRS512.key.pub')
  },
  {
    key: 'JSONWEBTOKEN_PRIVATE_KEY_PATH',
    required: false,
    default: join(__dirname, '../config/jwt/jwtRS512.key')
  },
  {
    key: 'EMAIL_SENDER',
    required: false,
    default: 'no-reply@anypayx.com'
  },
  {
    key: 'REQUIRE_BTC_CONFIRMATIONS',
    required: false,
    default: 'false'
  },
  {
    key: "BLOCKCYPHER_TOKEN",
    required: false
  },
  {
    key: "BLOCKCYPHER_WEBHOOK_TOKEN",
    required: false
  },
  {
    key: 'COINMARKETCAP_API_KEY',
    required: false,
  },
  {
    key: 'CRYPTOAPIS_KEY',
    required: false
  },
  {
    key: 'INFURA_POLYGON_URL',
    required: false
  },
  {
    key: 'INFURA_ETHEREUM_URL',
    required: false
  },
  {
    key: 'INFURA_AVALANCHE_URL',
    required: false
  },
  {
    key: "NOWNODES_API_KEY",
    required: false
  },
  {
    key: 'TEST_AMQP_URL',
    required: false
  },
  {
    key: 'TEST_DATABASE_URL',
    required: false
  },
  {
    key: 'SUDO_PASSWORD_HASH',
    required: false
  },
  {
    key: 'JSON_PROTOCOL_IDENTITY_ADDRESS',
    required: false
  },
  {
    key: 'JSON_PROTOCOL_IDENTITY_WIF',
    required: false
  },
  {
    key: 'WALLET_BOT_APP_ENABLED',
    required: false,
    default: 'false'
  },
  {
    key: 'WALLET_BOT_WEBSOCKET_PORT',
    required: false,
    default: '5202'
  },
  {
    key: 'ANYPAY_ACCESS_TOKEN',
    required: false
  },
  {
    key: 'NOWNODES_ENABLED',
    default: 'false',
    required: false
  },
  {
    key: 'GETBLOCK_LTC_URL',
    required: false
  },
  {
    key: 'GETBLOCK_BTC_URL',
    required: false
  },
  {
    key: 'GETBLOCK_BCH_URL',
    required: false
  },
  {
    key: 'GETBLOCK_DASH_URL',
    required: false
  },
  {
    key: 'GETBLOCK_BSV_URL',
    required: false
  },
  {
    key: 'GETBLOCK_DOGE_URL',
    required: false
  },
  {
    key: 'ALCHEMY_URL_SOLANA',
    required: false
  },
  {
    key: 'SOLANA_PHANTOM_SEED',
    required: false
  },
  {
    key: 'CHAIN_SO_BROADCAST_PROVIDER_ENABLED',
    required: false,
    default: true
  },
  {
    key: 'BLOCKCHAIR_BROADCAST_PROVIDER_BTC_ENABLED',
    required: false,
    default: true
  },
  {
    key: 'BITCOIND_RPC_HOST',
    required: false
  },
  {
    key: 'BITCOIND_RPC_USERNAME',
    required: false
  },
  {
    key: 'BITCOIND_RPC_PASSWORD',
    required: false
  },
  {
    key: 'DASH_RPC_URL',
    required: false
  },
  {
    key: 'DASH_RPC_URL_2',
    required: false
  },
  {
    key: 'DASH_RPC_URL_3',
    required: false
  },
  {
    key: 'DASH_RPC_USERNAME',
    required: false
  },
  {
    key: 'DASH_RPC_PASSWORD',
    required: false
  },
  {
    key: 'BSV_SIMPLE_WALLET_WIF',
    required: false
  },
  {
    key: 'BSV_SIMPLE_WALLET_ADDRESS',
    required: false
  },
  {
    key: 'TAAL_API_KEY',
    required: false
  },
  {
    key: 'BSV_RPC_USER',
    required: false
  },
  {
    key: 'BSV_RPC_PASSWORD',
    required: false
  },
  {
    key: 'BSV_RPC_URL',
    required: false
  },
  {
    key: 'XMR_RPC_URL',
    required: false
  },
  {
    key: 'XMR_RPC_USER',
    required: false
  },
  {
    key: 'XMR_RPC_PASSWORD',
    required: false
  },
  {
    key: 'MONERO_WALLET_RPC_URL',
    required: false
  },
  {
    key: 'REQUIRED_FEE_RATE_BTC',
    required: false,
    default: 1
  },  
  {
    key: 'REQUIRED_FEE_RATE_LTC',
    required: false,
    default: 1
  },
  {
    key: 'REQUIRED_FEE_RATE_DOGE',
    required: false,
    default: 1
  },
  {
    key: 'REQUIRED_FEE_RATE_DASH',
    required: false,
    default: 1
  },
  {
    key: 'REQUIRED_FEE_RATE_LTC',
    required: false,
    default: 1
  },
  {
    key: 'REQUIRED_FEE_RATE_BCH',
    required: false,
    default: 1
  },
  {
    key: 'REQUIRED_FEE_RATE_BSV',
    required: false,
    default: 1
  },
  {
    key: 'PROMETHEUS_PASSWORD',
    required: false
  }
]

export function asBoolean(key: string) {
  const value = config.get(key)

  if (value === 'false' || value === '0') {
    return false
  } else {
    return value
  }
}

variables.forEach(registerEnvironmentVariable)

config.argv({ parseValues: true }).env({
    parseValues: true,
    transform: function(obj: { key: string, value: any}) {
      const variable = variablesMap[obj.key]
      if (variable && variable.type === 'boolean') {
        if (obj.value === 'false') {
          return {
            key: obj.key,
            value: false
          }
        }
        if (obj.value === '0') {
          obj.value = false
        }       
      }
      return obj;
    }
  })
   .file({ file });

export function initialize() {
  // Restrict the allowed environment variables to ensure they are all documented here
  config.env(variables.map(v => v.key))

  // Ensure required environment variables are set
  config.required(variables.filter(v => v.required).map(v => v.key))

  // Set defaults for optional environment variables
  config.defaults(variables.filter(v => !!v.default).reduce((acc: any, v) => {
    acc[v.key] = v.default;
    return acc;
  }, {}))

}

initialize()

export { config } 
