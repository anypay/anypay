
import { Socket } from 'socket.io'

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

export const handlers = require('require-all')({

  dirname: `${__dirname}/socket.io/handlers`,

  filter:  /(.+)\.ts$/,

  resolve: handler => handler.default

});