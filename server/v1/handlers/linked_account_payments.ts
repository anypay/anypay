
import { log } from '../../../lib/log'

import * as links from '../../../lib/linked_accounts'

import { findAccount } from '../../../lib/account'

import { index as list_account_payments_handler } from './payments'

export async function index(request, h) {

  try {

    const source = request.params.account_id

    const target = request.account.id

    log.info('api.v1.linked_accounts.index', {
      source,
      target
    })

    let link = await links.getLink({ source, target })

    if (!link) {

      return h.unauthorized()

    }

    request.account = await findAccount(source)

    delete request.params['account_id']

    return list_account_payments_handler(request, h)

  }  catch(error) {

    log.error('api.v1.linked_accounts.index', error)

    return h.unauthorized()
    //return h.badRequest(error)

  }

}

