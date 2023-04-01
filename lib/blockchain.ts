

import { plugins } from './plugins'

import * as blockchair from './blockchair'

export async function getTransaction(currency: string, txid: string): Promise<any> {

  const plugin = plugins.findForChain(currency)

  if (plugin.getTransaction) {

    return plugin.getTransaction(txid)

  } else {

    return blockchair.getTransaction(currency, txid)
  }

}
