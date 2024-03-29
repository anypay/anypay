
import { WebSocket } from 'ws'

import { log } from '../../lib/log'

import { getWalletBot } from './'

import { WalletBots as WalletBot } from '@prisma/client'

interface AuthorizedSocket {
  socket: WebSocket;
  walletBot?: WalletBot;
}

import * as express from 'express';

export async function authenticate(socket: WebSocket, request: express.Request): Promise<AuthorizedSocket> {

  try {

    if (!request.headers['authorization']) {

      throw new Error('authorization header missing')

    }

    const token = request.headers['authorization'].split(' ')[1]

    log.info('wallet-bot.socket.io.authorization.bearer', {token})

    const walletBot = await getWalletBot({token})

    log.info('wallet-bot.socket.io.authenticated', walletBot)

    return { socket, walletBot }

  } catch(error: any) {

    socket.emit('authentication.error', { error: error.message })

    log.error('wallet-bot.socket.io.authentication.error', error)

    return { socket }

  }

}

