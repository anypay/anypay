
import plugins from './plugins'

export function getBitcore(currency) {

  let plugin = plugins(currency)

  if (!plugin.bitcore) {

    throw new Error('bitcore not found for currency')

  }

  return plugin.bitcore

}
