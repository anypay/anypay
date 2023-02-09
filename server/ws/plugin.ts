require('dotenv').config()

import { WebSocketServer } from "ws";

import { Server } from '@hapi/hapi'

import { log } from '../../lib/log'

//import { Actor } from 'rabbi'
import { Actor } from '/Users/zyler/github/rabbijs/rabbi'

export const plugin = (() => {

  return {

    name: 'websockets',

    register: function(server?: Server) {

      const port = process.env.websockets_port || 5201
      
      const wsServer = new WebSocketServer({ port });

      log.info('websockets.server.started', { port })

      wsServer.on("connection", async (socket) => {

        const account_id = 1177
    
        const actor = await Actor.create({

          exchange: 'anypay.events',

          routingkey: `accounts.${account_id}.events`,

          queue: `websocket_events_account_${account_id}`,

        })

        actor.start(async (channel, msg, json) => {

          socket.send(JSON.stringify(json))

        });

        log.info('websocket.connection', { socket })

        socket.on('close', () => {            

            console.log('Socket Close')

            console.log(actor)

            console.log(Object.keys(actor))

            actor.stop()

            log.info('websocket.close', { socket })

        })

        socket.on('error', () => {            

            log.info('websocket.error', { socket })

        })
      
        // receive a message from the client
        wsServer.on("message", (data) => {

          log.info('websocket.message.received', {data})

          const packet = JSON.parse(data);

          switch (packet.type) {
            case "hello from client":
              // ...
              break;
          }
        });

      });

    }

  }

})()

if (require.main === module) {

  plugin.register()

}
