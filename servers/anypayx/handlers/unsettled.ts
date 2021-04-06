
import { listUnsettled } from '../../../lib/anypayx'

import * as Boom from 'boom';

import { logError } from '../../../lib/logger'

export async function index(req, h) {

  try {

    let unsettled = await listUnsettled({
      account_id: req.account.id,
    })

    return { unsettled }

  } catch(error) {

    logError('anypayx.handlers.unsettled.show', error)

    return Boom.badRequest(error)

  }

}

