require('dotenv').config()

import { WebSocketServer, WebSocket } from 'ws'

import { Request, Server } from '@hapi/hapi'

import { log } from '../../lib/log'

import { Actor } from 'rabbi'

import { awaitChannel, channel, exchange } from '../../lib/amqp'

import { models } from "../../lib";

class AliveSocket extends WebSocket {
  isAlive?: boolean;
}

import { v4 } from 'uuid'

async function handleInvoiceWebsocket(invoice_uid: string, socket: WebSocket, req: Request) {

  await awaitChannel()


  const invoice = await models.Invoice.findOne({ where: { uid: invoice_uid }})

  if (!invoice) { return socket.close(1008, "InvoiceNotFound") }

  const socket_uid = v4()

  const queue = `websocket_invoice_events_${socket_uid}`

  const actor = await Actor.create({

    exchange,

    routingkey: `invoices.${invoice_uid}.events`,

    queue

  })

  actor.start(async (channel, msg, json) => {

    socket.send(JSON.stringify(json))

  });

  log.info('websocket.connection', { socket })

  socket.on('close', () => {            

      actor.stop()

      channel.deleteQueue(queue)

      log.info('websocket.close', { socket })

  })

  socket.on('error', () => {            

      log.info('websocket.error', { socket })

  })
   
}

export const plugin = (() => {

  return {

    name: 'websockets',

    register: function(server?: Server) {

      function heartbeat(socket: AliveSocket) {
        socket.isAlive = true;
      }

      const port = Number(process.env.WEBSOCKETS_PORT) || 5201
      
      const wsServer = new WebSocketServer({ port });

      log.info('websockets.server.started', { port })

      wsServer.on("connection", async (socket: WebSocket, request: Request) => {

        if (request.headers['anypay-invoice-uid']) {

          const invoice_uid = String(request.headers['anypay-invoice-uid'])

          return handleInvoiceWebsocket(invoice_uid, socket, request)

        }

        const uid = request.headers['anypay-access-token']     
        
        if (uid) {

          const accessToken = await models.AccessToken.findOne({
            where: {
              uid
            }
          });
        
          if (!accessToken) {

            log.error('websocket.auth.error', new Error('access token not found'))

          }

          const account = await models.Account.findOne({
            where: {
              id: accessToken.account_id
            }
          })

          if (!account) {

            log.error('websocket.auth.error', new Error('account not found'))
            
          }

          const actor = await Actor.create({

            exchange,

            routingkey: `accounts.${account.id}.events`,

            queue: `websocket_events_account_${account.id}`,

          })

          actor.start(async (channel, msg, json) => {

            socket.send(JSON.stringify(json))

          });

          log.info('websocket.connection', { socket })

          socket.on('close', () => {            

              actor.stop()

              log.info('websocket.close', { socket })

          })

          socket.on('error', () => {            

              log.info('websocket.error', { socket })

          })


        }

        socket.on('message', (message) => {

          const json = JSON.parse(message.toString())

          if (json.type === 'invoice.subscribe' && json.payload.uid) {

            handleInvoiceWebsocket(json.payload.uid, socket, request)

          }

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
        socket.on('pong', () => heartbeat(socket));
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
