
import { monthlyTransactions, monthlyBalance } from '../../../lib/anypayx'

import * as Boom from 'boom';

import { logError } from '../../../lib/logger'

export async function show(req, h) {

  try {

    let date = new Date(`${req.params.month}/01/${req.params.year}`)

    let transactions = await monthlyTransactions({
      account_id: req.account.id,
      month: req.params.month,
      year: req.params.year
    })

    let balance = await monthlyBalance({
      account_id: req.account.id,
      month: req.params.month,
      year: req.params.year
    })

    return { transactions, balance }

  } catch(error) {

    logError('anypayx.handlers.reports.show', error)

    return Boom.badRequest(error)

  }

}

