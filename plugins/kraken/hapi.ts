
import { log } from '../../lib/log'

import { Server } from 'hapi'

import { start } from './main'

export const plugin = (() => {

  return {

    name: 'kraken',

    register: function(server: Server, options, next) {

      log.info('server.plugins.register.kraken')

      start()

    }

  }

})()

