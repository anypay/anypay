
import * as links from '../../../lib/linked_accounts'

import { log } from '../../../lib/log'

export async function index(request, h) {

  log.info('api.v1.linked_accounts.index', {
    ...request.query,
    account_id: request.account.id
  })

  const linked_accounts = await links.listLinkedAccounts(request.account, request.query)

  return h.response({
    linked_accounts
  })
  .code(200)

}

export async function create(request, h) {

  log.info('api.v1.linked_accounts.create', {
    ...request.payload,
    account_id: request.account.id
  })

  const linked_account = await links.linkAccount(request.account, request.payload)

  return h.response({
    linked_account
  })
  .code(201)

}

export async function unlink(request, h) {

  log.info('api.v1.linked_accounts.unlink', {
    ...request.payload,
    account_id: request.account.id
  })

  await links.unlinkAccount(request.account, request.params)

  return h.response({
    success: true
  })
  .code(200)

}


