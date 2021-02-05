
import { listTransactions, settleAccount } from '../../../lib/anypayx'

import * as Boom from 'boom';

import { logError } from '../../../lib/logger'

export async function index(req, h) {

  let transactions = await listTransactions(req.account.id)

  return { transactions }

}

export async function create(req, h) {

  try {

    let debit = await settleAccount(req.account.id)

    return { debit }

  } catch(error) {

    logError('servers.anypayx.handlers.transactions.create', error)

    return Boom.badRequest(error)

  }

}


