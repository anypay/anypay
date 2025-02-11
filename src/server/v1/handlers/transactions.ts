
//import { plugins } from '../../../lib/plugins'

import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest'
import { log } from '@/lib'
import { find } from '@/lib/plugins'

import { badRequest } from '@hapi/boom'
import { Request, ResponseToolkit } from '@hapi/hapi'

// broadcast transaction

export async function create(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  try {
    //const { chain, currency, transaction } = req.payload

    //let plugin = plugins.find({ chain, currency })

    //let result = await plugin.broadcastTx({ txhex: transaction })

    //return { result }
    return {  }

  } catch(error: any) {

    log.error('server.v1.handlers.transactions.create', error)

    return badRequest(error)

  }

}

// function to decode a transaction given its hex, chain and currency
export async function decode(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  const { chain, currency, txhex } = request.payload as { chain: string, currency: string, txhex: string }

  let plugin = find({ chain, currency })

  let result = await plugin.parsePayments({ txhex })

  return { result, chain, currency, txhex }

}