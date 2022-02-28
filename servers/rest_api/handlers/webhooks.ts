
import { listForAccount } from '../../../lib/webhooks'

import { findAccount } from '../../../lib/account'

export async function index(req, h) {

  try {

    let account = await findAccount(req.account.id)

    let webhooks = await listForAccount(account, {
      limit: req.query.limit,
      offset: req.query.offset
    })

    return { webhooks }

  } catch(error) {

    console.log('ERROR', error)

    return { error }
  }

}
