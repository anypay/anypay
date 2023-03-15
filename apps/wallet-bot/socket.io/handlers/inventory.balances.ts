
import { Socket } from 'socket.io'

import { log } from '../../../../lib/log'

export interface Balance {
  currency?: string;
  chain?: string;
  asset?: string;
  balance?: number;
  value?: number;
  usd_value?: number;
  last_updated?: Date;
  address?: string;
}

export default async function (socket: Socket, balances: Balance[]) {

  log.info(`wallet-bot.websocket.handlers.inventory.balances`, balances)

  for (let balance of balances) {

    const currency = balance.currency || balance.asset
    const chain = balance.chain || balance.asset

    try {

      const [result] = await socket.data.walletBot.setAddressBalance({
        currency,
        chain,
        balance: balance.balance || balance.value,
        address: balance.address
      })

      console.log('walletbot.setAddressBalance', result.toJSON())

    } catch(error) {

      console.error('walletbot.setAddressBalance.error', error)

    }

  }

  socket.data.balances = balances

}

