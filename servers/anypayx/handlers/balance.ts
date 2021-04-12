
import { balanceAtDate } from '../../../lib/anypayx'

import * as Boom from 'boom';

import { logError } from '../../../lib/logger'

export async function show(req, h) {

  try {

    let date = new Date(`${req.params.month}/${req.params.day}/${req.params.year}`)

    let balance = await balanceAtDate(req.account.id, date)

    return { date, balance }

  } catch(error) {

    logError('anypayx.handlers.balance.show', error)

    return Boom.badRequest(error)

  }

}

