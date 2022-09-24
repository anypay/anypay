
import { getCoins } from '../../../lib/coins'

import { convert } from '../../../lib/prices'

export async function index(req, h) {

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

    let { value: price } = await convert({ currency: coin.code, value: 1 }, 'USD')

    result['price'] = price

    return result

  }))

  return h.response({ coins }).code(200)

}
