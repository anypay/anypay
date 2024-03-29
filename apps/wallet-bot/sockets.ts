
import { WebSocket } from 'ws'

import { WalletBots as WalletBot } from '@prisma/client'

/*
 *
 * In-memory data structure for tracking sockets connections.
 *
 */

type LiveSockets = {

  [key: string]: WebSocket

}

export const sockets: LiveSockets = {}

export function getSocket(walletBot: WalletBot): WebSocket | null {

  const socket = sockets[walletBot.id]

  return socket

}

export function setSocket(walletBot: WalletBot, socket: WebSocket): WebSocket {

  let existingSocket = getSocket(walletBot)

  if (existingSocket) {

    throw new Error('Socket Already Connected For Wallet Bot')
  }

  sockets[walletBot.id] = socket

  return socket

}


export function removeSocket({socket, walletBot }: {socket: WebSocket, walletBot: WalletBot}): void {

    let existingSocket = getSocket(walletBot)

    if (existingSocket) {

      if (socket.OPEN) {

        socket.close()

      }

      delete sockets[walletBot.id]

    }


}

interface LiveSocket {

  wallet_bot_id: string;

  socket: WebSocket;
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

  resolve: (handler: any) => handler.default

});