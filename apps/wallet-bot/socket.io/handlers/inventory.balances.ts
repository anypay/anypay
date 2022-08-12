
import { Socket } from 'socket.io'

import { log } from '../../../../lib/log'

export default async function (socket: Socket, json: any) {

    log.info(`wallet-bot.websocket.handlers.inventory.balances`, json)

    socket.data.balances = json

}
