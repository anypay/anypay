
import { badRequest } from 'boom'

import { listPrices } from '../../../lib/prices'

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

  } catch(error) {

    return badRequest(error)

  }

}
