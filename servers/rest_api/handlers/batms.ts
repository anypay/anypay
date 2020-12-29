
import * as vending from '../../../lib/vending'

import * as Boom from 'boom'

export async function index(req, h) {

  let batms = await vending.listBatmsForAccount(req.account.id)

  return { batms }

}

export async function show(req, h) {

  try {

    let { batm, transactions } = await vending.getAccountBatmWithTransactions(req.account.id, req.params.batm_id)

    return { batm, transactions }

  } catch(error) {

    return Boom.badRequest(error)

  }

}

