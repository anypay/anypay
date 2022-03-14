
import { Account } from '../lib/account'

import { WebSocket } from 'ws'

import { log } from '../lib/logger/log'

import { authorizeAccount } from '../lib/auth'

type Token = string;

interface AccountSocket {
  account: Account;
  socket: WebSocket;
  token: Token;
}

export async function authenticate(socket: WebSocket, token: string): Promise<AccountSocket> {

  try {

    let account = await authorizeAccount(token)

    log.info('websocket.authenticated', { account_id: account.id })

    return { socket, account, token }

  } catch(error) {

    socket.emit('authentication.error', { error: error.message })

    log.error('websocket.authentication.error', error)

    throw error

  }

}

