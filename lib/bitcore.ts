
import { find } from './plugins'

export function getBitcore(currency: string) {

  let plugin = find({ currency, chain: currency })

  if (!plugin.bitcore) {

    return {} 

  }

  return plugin.bitcore

}

