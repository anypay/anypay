
import * as links from '../../../lib/linked_accounts'

import { log } from '../../../lib/log'

export async function index(request, h) {

  try {

    console.log({ account_idd : request.account.id })

    log.info('api.v1.linked_accounts.index', {
      ...request.query,
      account_id: request.account.id
    })

    const linked_accounts = await links.listLinkedAccounts(request.account, request.query)

    return h.response({
      linked_accounts
    })
    .code(200)

  }  catch(error) {

    log.error('api.v1.linked_accounts.index', error)

    return h.badRequest(error)

  }

}

export async function create(request, h) {

  try {

    request.log.info('api.v1.linked_accounts.create', {
      ...request.payload,
      account_id: request.account.id
    })

    const linked_account = await links.linkAccount(request.account, request.payload)

    return h.json({
      linked_account
    })

  }  catch(error) {

    request.log.error('api.v1.linked_accounts.create', error)

    return h.badRequest(error)

  }

}

export async function unlink(request, h) {

  try {

    request.log.info('api.v1.linked_accounts.unlink', {
      ...request.payload,
      account_id: request.account.id
    })

    const linked_account = await links.unlinkAccount(request.account, request.payload)

    return h.json({
      linked_account
    })

  }  catch(error) {

    request.log.error('api.v1.linked_accounts.unlink', error)

    return h.badRequest(error)

  }

}


