
import { getCoins } from '@/lib/coins'

import { convert } from '@/lib/prices'

import { log } from '@/lib/log'
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest'
import { Request, ResponseToolkit } from '@hapi/hapi'

export async function index(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  let coins = await getCoins()

  //coins = coins.filter(coin => coin.supported && !coin.unavailable)

  const response = await Promise.all(coins.map(async coin => {

    var result: any = {
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

  return h.response({ coins: response }).code(200)

}

