
require('dotenv').config()

import { start } from './servers/v0/server'

import { start as startPrices } from './lib/prices/cron'

import { events, init } from 'rabbi'

(async () => {

  await init()

  startPrices()

  await start()

  events.emit('servers.rest_api.started')

})()

