
//import { plugins } from '../../../lib/plugins'

import { log } from '../../../lib'

import { badRequest } from 'boom'

// broadcast transaction

export async function create(req, h) {

  try {
    //const { chain, currency, transaction } = req.payload

    //let plugin = plugins.find({ chain, currency })

    //let result = await plugin.broadcastTx({ txhex: transaction })

    //return { result }
    return {  }

  } catch(error) {

    log.error('server.v1.handlers.transactions.create', error)

    return badRequest(error)

  }

}
