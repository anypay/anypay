
import { badRequest } from '@hapi/boom'

import { listPrices, getPriceHistory } from '../../../lib/prices'
import { Request, ResponseToolkit } from '@hapi/hapi'

export async function index() {

  try {

    const prices = await listPrices()

    return {

      prices: prices.map(price => {

        const { currency, value, base, updatedAt, source } = price

        return {
          currency,
          base,
          value,
          updatedAt,
          source
        }

      })

    }

  } catch(error: any) {

    return badRequest(error)

  }

}

export async function show(request: Request, h: ResponseToolkit) {

  try {

    const { currency } = request.params

    const result = await getPriceHistory(currency)

    return result

  } catch(error: any) {

    return badRequest(error.message)

  }

}
