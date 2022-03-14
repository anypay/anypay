require('dotenv').config()

import { WebSocket, WebSocketServer } from 'ws';

import { log } from '../lib/log'

import * as uuid from 'uuid'

import { awaitChannel } from '../lib/amqp'

import { authenticate } from './auth'

interface Event {
  type: string;
  payload: any;
}

function sendMessage(socket: WebSocket, type: string, payload: any) {

  socket.send(JSON.stringify({type, payload}))
  
}

const handlers = {

  'authorization': async (socket: WebSocket, {type, payload}: Event) => {

    const { account } = await authenticate(socket, payload.token)

    sendMessage(socket, 'authenticated', {

      accountId: account.id,

      sessionId: socket.sessionId

    })

    const channel = await awaitChannel()

    const sessionId = uuid.v4()

    const queue = `ws.account.1177.${sessionId}`

    socket.queue = queue

    socket.sessionId = sessionId

    await channel.assertQueue(queue, {

      autoDelete: true

    })

    await channel.bindQueue(queue, `anypay.topic`, `accounts.${account.id}.events`)

    socket.on('close', async () => {

      socket.closed = true

      log.info('ws.close')

      try {

        await channel.cancel(sessionId)

        await channel.deleteQueue(queue)

      } catch(error) {

      }

    });

    channel.consume(queue, async (msg) => {

      try {

        if (msg === null) {

          log.info('ws.amqp.consumer.close', {

            sessionId

          })

        }
        const message = msg.content.toString()

        const json = JSON.parse(message)

        if (json.type && json.payload) {

          await sendMessage(socket, json.type, json.payload)

        }

        channel.ack(msg)

      } catch(error) {

        log.error('ws.amqp.consumer.error', error)

      }

    }, {

      consumerTag: sessionId

    })

  }
}

export async function start(server?: any) {

  const wss = server ? new WebSocketServer({

    server

  }) : new WebSocketServer({

    port: process.env.WEBSOCKETS_PORT || 8090

  })

  log.info('ws.server.start', wss.info)

  const channel = await awaitChannel()

  await channel.assertExchange('anypay.topic', 'topic')

  wss.on('connection', async (socket) => {

    socket.closed = false

    const sessionId = uuid.v4()

    socket.sessionId = sessionId

    log.info('ws.connection', { sessionId })

    socket.on('message', async (data) => {

      let event = parseEvent(data)
      
      log.info(`ws.client.event.${event.type}`, event.payload)

      if (handlers[event.type]) {

        try {

          await handlers[event.type](socket, event)

        } catch(error) {

          log.error(`ws.client.event.${event.type}.error`, {

            error: error.message,

            name: error.name

          })

        }

      }

    });
  });

  function parseEvent(data: Buffer): Event {

    const message = data.toString()

    try {

      const {type, payload} = JSON.parse(message)

      if (!type && !payload) {

        return {
          type: 'invalid',
          payload: { message }
        }

      }

      return { type, payload }


    } catch(error) { 

      return {
        type: 'invalid',
        payload: { message }
      }

    }
  }

}

if (require.main === module) {

  start()

}

