
import { Socket } from 'socket.io'

import * as Joi from 'joi'

import { authenticate } from './auth'

import { subscribe, unsubscribe } from './pubsub'

import * as uuid from 'uuid'

type LiveSockets = {
  [key: string]: Socket
}

export const sockets: LiveSockets = {}

export class Sockets {

  static async connect(socket) {

    socket.sessionId = uuid.v4()

    socket.on('authenticate', async (token) => {

      await subscribe(socket)

    })

  }

  static async disconnect(socket: Socket) {

    await unsubscribe(socket)

  }

}

