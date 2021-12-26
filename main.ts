
require('dotenv').config()

import { start } from './servers/rest_api/server'

import { events, init } from 'rabbi'

(async () => {

  await init()

  await start()

  events.emit('servers.rest_api.started')

})()

