require('dotenv').config()

//import { log } from './log'

const nconf = require('nconf')

const os = require('os')

nconf.argv({
  parseValues: true,
  transform
})

nconf.env({
  parseValues: true,
  transform
})

const global_file = `/etc/wallet-bot/wallet-bot.json`

const user_file = `${os.homedir()}/.wallet-bot/wallet-bot.json`

const project_file = `${process.cwd()}/.wallet-bot/wallet-bot.json`

nconf.add('project_file', { type: 'file', file: project_file, transform })

nconf.add('user_file', { type: 'file', file: user_file, transform })

nconf.add('global_file', { type: 'file', file: global_file, transform })

export function loadFromFiles() {

  nconf.use('project_file', { type: 'file', file: project_file, transform })

  nconf.use('user_file', { type: 'file', file: user_file, transform })

  nconf.use('global_file', { type: 'file', file: global_file, transform })

}

loadFromFiles()

process.on('SIGHUP', () => {

  loadFromFiles()

})

nconf.defaults({
  config: '/etc/wallet-bot/wallet-bot.json',
  host: '0.0.0.0',
  port: 5200,
  prometheus_enabled: true,
  amqp_enabled: false,
  http_api_enabled: true,
  swagger_enabled: true,
  postgres_enabled: false,
  database_url: 'postgres://postgres:password@postgres:5432/rabbi',
  amqp_url: 'amqp://guest:guest@rabbitmq:5672/rabbi',
  amqp_exchange: 'rabbi',
  loki_enabled: false,
  loki_label_app: 'wallet-bot',
  api_base: 'https://api.anypayx.com',
  wallets: [],
  socket_io_host: 'wss://api.anypayx.com',
  socket_io_path: '/v1/apps/wallet-bot',
  socket_io_reconnection_delay_max: 10000,
  btc_fee_rate: 'economyFee'
})

export default nconf

function transform(obj) {
  return {
    key: obj.key.toLowerCase(),
    value: obj.value
  }
}

