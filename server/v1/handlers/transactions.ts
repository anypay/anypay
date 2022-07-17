
import { plugins } from '../../../lib/plugins'

import { badRequest } from 'boom'

// broadcast transaction

export async function create(req, h) {

  try {

    let plugin = plugins.findForCurrency(req.payload.chain)

    let result = await plugin.broadcast(req.payload.transaction)

    console.log(result)

    return { result }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}
