require('dotenv').config()

import { WebSocketServer, WebSocket } from 'ws'

import { Server } from '@hapi/hapi'

import { log } from '../../lib/log'

import { Actor } from 'rabbi'

import { models } from "../../lib";

class AliveSocket extends WebSocket {
  isAlive: boolean;
}

export const plugin = (() => {

  return {

    name: 'websockets',

    register: function(server?: Server) {

      function heartbeat() {
        this.isAlive = true;
      }

      const port = Number(process.env.websockets_port) || 5201
      
      const wsServer = new WebSocketServer({ port });

      log.info('websockets.server.started', { port })

      wsServer.on("connection", async (socket, req) => {

        const headers = req.headers

        console.log('ws.connection.headers', headers)

        const uid = req.headers['anypay-access-token']

        const accessToken = await models.AccessToken.findOne({
          where: {
            uid
          }
        });
      
        if (!accessToken) {

          log.error('websocket.auth.error', new Error('access token not found'))

          socket.close(1008, 'Unauthorized') // 1008: policy violation

        }

        const account = await models.Account.findOne({
          where: {
            id: accessToken.account_id
          }
        })

        if (!account) {

          log.error('websocket.auth.error', new Error('account not found'))

          socket.close(1008, 'Unauthorized') // 1008: policy violation
          
        }

        const actor = await Actor.create({

          exchange: 'anypay.events',

          routingkey: `accounts.${account.id}.events`,

          queue: `websocket_events_account_${account.id}`,

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

      wsServer.on('connection', function connection(socket: AliveSocket) {
        socket.isAlive = true;
        socket.on('error', console.error);
        socket.on('pong', heartbeat);
      });

      const interval = setInterval(function ping() {
        wsServer.clients.forEach(function each(socket: AliveSocket) {
          if (socket.isAlive === false) return socket.terminate();

          socket.isAlive = false;
          socket.ping();
        });
      }, 30000);

      wsServer.on('close', function close() {
        clearInterval(interval);
      });

    }

  }

})()

if (require.main === module) {

  plugin.register()

}
