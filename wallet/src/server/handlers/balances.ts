
import log from '../../log'

import { badRequest } from 'boom'

import { listBalances, Balance } from '../../balances'

export async function index(req, h) {

  try {

    let balances: Balance[] = await listBalances()

    return {

      balances

    }

    log.debug('api.handlers.Balances.index.result', balances)


  } catch(error) {

    log.error('api.handlers.Balances.index', error)

    return badRequest(error)

  }

}
