
import { Trace } from '../trace'

import { log } from '../log'

import { BroadcastTransactionResult } from '../plugins'

import plugins from '../plugins'

export async function broadcast(currency:string, hex:string): Promise<BroadcastTransactionResult> {

  const trace = Trace()

  log.info('pay.broadcast', { currency, hex, trace})

  const result = plugins(currency).broadcastTx(hex)

  log.info('pay.broadcast.result', { currency, hex, trace })

  return result 

}
