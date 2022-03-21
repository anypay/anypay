require('dotenv').config()

import { log } from '../lib/log'

import { start } from './server'

import { Server } from 'hapi'

export const plugin = (() => {

  return {

    name: 'websockets',

    register: function(server: Server, options, next) {

      log.info('server.plugins.register.websockets')

      server.listener.on('upgrade', () => {

        log.info('server.upgrade')

      })

      const wss = start(server.listener)

    }

  }

})()


if (require.main === module) {

  (async () => {

    const server = new Server({
      host: process.env.HOST || "localhost",
      port: process.env.PORT || 8090,
      routes: {
        cors: true
      }
    });

    await server.register(plugin)

    log.info('websockets.server.start')

    await server.start();
    
    log.info('websockets.server.started', server.info)

  })()

}

