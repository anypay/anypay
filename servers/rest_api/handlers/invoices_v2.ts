import * as Boom from 'boom'
import * as Joi from 'joi'

import { v2 } from '../../../lib/v2'
import { log } from '../../../lib'

export async function create(req, h) {

  let account = v2.accounts.build(req.account)

  let invoice = await account.invoices.create({
    amount: req.payload.amount,
    currency: account.currency
  })

  return {

    invoice: invoice.toJSON()

  }

};

