
import { find } from './plugins'

export function getBitcore(currency) {

  let plugin = find({ currency, chain: currency })

  if (!plugin.bitcore) {

    return {} 

  }

  return plugin.bitcore

}

