
import { Socket } from 'socket.io'

import { log } from '../../lib/log'

import { getWalletBot, WalletBot } from './'

interface AuthorizedSocket {
  socket: Socket;
  walletBot?: WalletBot;
}

export async function authenticate(socket: Socket): Promise<AuthorizedSocket> {

  try {

    const { address } = socket.handshake

    log.info('wallet-bot.socket.io.authenticate', { address })

    if (!socket.handshake.headers.authorization) {

      throw new Error('authorization header missing')

    }

    const token = socket.handshake.headers['authorization'].split(' ')[1]

    log.info('wallet-bot.socket.io.authorization.bearer', {token})

    const walletBot = await getWalletBot({token})

    log.info('wallet-bot.socket.io.authenticated', walletBot)

    return { socket, walletBot }

  } catch(error) {

    socket.emit('authentication.error', { error: error.message })

    log.error('wallet-bot.socket.io.authentication.error', error)

    return { socket }

  }

}

