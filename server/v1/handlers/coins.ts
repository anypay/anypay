
import { getCoins } from '../../../lib/coins'

import { convert } from '../../../lib/prices'

import { log } from '../../../lib/log'

export async function index(req, h) {

  log.debug('api.v1.coins.index', { path: req.path })

  let coins = await getCoins()

  //coins = coins.filter(coin => coin.supported && !coin.unavailable)

  coins = await Promise.all(coins.map(async coin => {

    var result = {
      name: coin.name,
      code: coin.code,
      logo: coin.logo_url,
      precision: coin.precision,
      enabled: coin.supported && !coin.unavailable,
      color: coin.color
    }

    try {

      let { value: price } = await convert({ currency: coin.code, value: 1 }, 'USD')

      result['price'] = price

    } catch(error) {

      log.debug('coin.price.convert.error', error)

    }

    return result

  }))

  return h.response({ coins }).code(200)

}

