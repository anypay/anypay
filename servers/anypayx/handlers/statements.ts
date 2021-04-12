
import { monthlyTransactions, monthlyBalance, getStatement, allStatements } from '../../../lib/anypayx'

import * as Boom from 'boom';

import { logError } from '../../../lib/logger'

export async function index(req, h) {

  try {

    let statements = await allStatements({
      account_id: req.account.id,
      include_transactions: req.query.include_transactions || false
    })

    return { statements }

  } catch(error) {

    logError('anypayx.handlers.reports.show', error)

    return Boom.badRequest(error)

  }

}

export async function show(req, h) {

  try {

    let date = new Date(`${req.params.month}/01/${req.params.year}`)

    let { transactions, balance } = await getStatement({
      account_id: req.account.id,
      month: req.params.month,
      year: req.params.year,
      include_transactions: req.query.include_transactions || false
    })

    return { transactions, balance }

  } catch(error) {

    logError('anypayx.handlers.reports.show', error)

    return Boom.badRequest(error)

  }

}

