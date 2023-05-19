
import { Socket } from 'socket.io-client'

import { listBalances } from '../../balances'

import { log } from '../../log'

export default async function (socket: Socket, json?: any) {

    log.info(`wallet-bot.websocket.handlers.inventory.balances`, json)

    const balances = await listBalances()

    for (let balance of balances) {

        log.info('wallet-bot.balance', balance)
    }

    socket.emit('inventory.balances', balances)

    return balances

}
