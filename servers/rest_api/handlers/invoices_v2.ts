import * as Boom from 'boom'
import * as Joi from 'joi'

import { v2 } from '../../../lib/v2'
import { log } from '../../../lib'

export async function create(req, h) {

  let account = v2.accounts.build(req.account)

  let invoice = await account.invoices.create(Object.assign({
    currency: account.currency
  }, req.payload))

  return {

    invoice: invoice.toJSON()

  }

};

export async function show(req, h) {

  try {

    let invoice = await v2.invoices.find(req.params.uid)

    return {

      invoice: invoice.toJSON()

    }

  } catch(error) {
    console.log(error)

    return Boom.notFound(error.message)

  }

};

