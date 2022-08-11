
import { Socket } from 'socket.io'

import { Option, Some, None } from 'option-type';

import * as Joi from 'joi'

import { authenticate } from './auth'

import { subscribe, unsubscribe } from './pubsub'

import * as uuid from 'uuid'

import { WalletBot } from './'


/*
 *
 * In-memory data structure for tracking sockets connections.
 *
 */

type LiveSockets = {

  [key: string]: Socket

}

export const sockets: LiveSockets = {}

export function getSocket(walletBot: WalletBot): Socket | null {

  const socket = sockets[walletBot.id]

  return socket

}

export function setSocket(walletBot: WalletBot, socket: Socket): Socket {

  let existingSocket = getSocket(walletBot)

  if (existingSocket) {

    throw new Error('Socket Already Connected For Wallet Bot')
  }

  sockets[walletBot.get('id')] = socket

  return socket

}


export function removeSocket(socket: Socket): void {

  if (socket.data && socket.data.walletBot) {

    let existingSocket = getSocket(socket.data.walletBot)

    if (existingSocket) {

      if (socket.connected) {

        socket.disconnect()

      }

      delete sockets[socket.data.walletBot.id]

    }

  }

}

interface LiveSocket {

  wallet_bot_id: string;

  socket: Socket;
}

export function listSockets(): LiveSocket[] {

  return Object.keys(sockets).map(wallet_bot_id => {

    return {

      wallet_bot_id,

      socket: sockets[wallet_bot_id]

    }

  })

}

