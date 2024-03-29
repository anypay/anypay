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

import { WebSocketServer, WebSocket } from 'ws'

import { Request, Server } from '@hapi/hapi'

import { log } from '../../lib/log'

import { Actor } from 'rabbi'

import { awaitChannel, channel, exchange } from '../../lib/amqp'

import { config } from "../../lib";

class AliveSocket extends WebSocket {
  isAlive?: boolean;
}

import { v4 } from 'uuid'
import prisma from '../../lib/prisma'

async function handleInvoiceWebsocket(invoice_uid: string, socket: WebSocket, req: Request) {

  await awaitChannel()

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: invoice_uid
    }
  })

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

      const port = Number(config.get('WEBSOCKETS_PORT')) || 5201
      
      const wsServer = new WebSocketServer({ port });

      log.info('websockets.server.started', { port })

      wsServer.on("connection", async (socket: WebSocket, request: Request) => {

        console.log('connection', request.headers)

        if (request.headers['anypay-invoice-uid']) {

          const invoice_uid = String(request.headers['anypay-invoice-uid'])

          return handleInvoiceWebsocket(invoice_uid, socket, request)

        }

        const uid = request.headers['anypay-access-token']     
        
        if (uid) {

          const accessToken = await prisma.access_tokens.findFirstOrThrow({
            where: {
              uid: String(uid)
            }
          });

          const account = await prisma.accounts.findFirstOrThrow({
            where: {
              id: accessToken.account_id
            }   
          })

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
