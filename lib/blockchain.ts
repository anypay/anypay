

import { plugins } from './plugins'

export async function getTransaction(currency: string, txid: string): Promise<any> {

  const plugin = plugins.find(currency)

  const transaction = await plugin.getTransaction(txid)

  return transaction

}
