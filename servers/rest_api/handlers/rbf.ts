
import * as Boom from 'boom'

import { getNode } from '../../../lib/btc_traverser'

import { log } from '../../../lib/logger'

export async function show(req, h) {

  try {

    let node = await getNode(req.params.txid)

    return {
      txid: req.params.txid,
      rawtx: node.rawtx,
      is_replace_by_fee: node.replace_by_fee
    }

  } catch(error) {

    log.error('servers.rest_api.handlers.rbf.show', error.message)

    return Boom.badRequest(error)

  }

}
