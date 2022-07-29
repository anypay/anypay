
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

    log.info('api.v1.linked_accounts.create', {
      ...request.payload,
      account_id: request.account.id
    })

    const linked_account = await links.linkAccount(request.account, request.payload)

    return h.response({
      linked_account
    })
    .code(201)

  }  catch(error) {

    log.error('api.v1.linked_accounts.create', error)

    return h.badRequest(error)

  }

}

export async function unlink(request, h) {

  try {

    log.info('api.v1.linked_accounts.unlink', {
      ...request.payload,
      account_id: request.account.id
    })

    const linked_account = await links.unlinkAccount(request.account, request.params)

    return h.response({
      success: true
    })
    .code(200)

  } catch(error) {

    log.error('api.v1.linked_accounts.unlink', error)

    return h.badRequest(error)

  }

}


