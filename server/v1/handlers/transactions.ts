
import plugins from '../../../lib/plugins'

import { log } from '../../../lib'

import { badRequest } from 'boom'

export async function create(req, h) {

  try {

    let plugin = plugins(req.payload.chain)

    let result = await plugin.broadcast(req.payload.transaction)

    return { result }

  } catch(error) {

    log.error('server.v1.handlers.transactions.create', error)

    return badRequest(error)

  }

}
