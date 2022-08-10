
import { Socket } from 'socket.io'

import { sockets } from './sockets'

import { log } from '../../lib/log'

export async function subscribe(socket: any) {

  log.debug('wallet-bot.socket.subscribe', { sessionId: socket.sessionId, socket })

  sockets[socket.sessionId] = socket

}

export async function unsubscribe(socket: any) {

  log.debug('wallet-bot.socket.unsubscribe', { sessionId: socket.sessionId, socket })

  delete sockets[socket.sessionId]

}

export async function broadcast(event: string, payload: any) {

  log.debug('wallet-bot.pubsub.broadcast', { event, payload })

  Object.values(sockets).forEach(socket => {

    socket.emit(event, payload)

  })

}
