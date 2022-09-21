import * as http from 'superagent'

import { log } from '../log'

export interface BroadcastResult {
  provider: string,
  txid: string,
  hex: string,
  metadata?: any,
  error?: Error
}

async function broadcastBlockchair(currency: string, hex: string): Promise<BroadcastResult> {

  log.info('blockchair.broadcast', {currency, hex})

  let resp = await http.get(`https://api.blockchair.com/${currency}/push/transaction?data=${hex}`)

  log.info('blockchair.broadcast.response', Object.assign(resp, {
    currency, hex
  }))

  return Object.assign(resp, { provider: 'blockchair' })
}

export async function broadcast(currency:string, hex:string): Promise<BroadcastResult> {
  var result;

  switch (currency) {
  case 'BTC':

    result = await broadcastBlockchair('bitcoin', hex) 

    return result
  case 'LTC':

    result = await broadcastBlockchair('litecoin', hex) 

    return result
  case 'DOGE':

    result = await broadcastBlockchair('dogecoin', hex) 

    return result
  case 'ZEC':

    result = await broadcastBlockchair('zcash', hex) 

    return result
  }

}
