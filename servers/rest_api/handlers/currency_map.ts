
import { badRequest } from 'boom'

import {createCoinTextInvoice} from '../../../lib/cointext'
import { models } from '../../../lib'

export async function index(req, h) {

  try {

    let invoice = await models.Invoice.findOne({ where: {
    
      uid: req.params.uid

    }})

    return  createCoinTextInvoice(invoice.address, invoice.invoice_amount, invoice.invoice_currency)

  } catch(error) {

    return badRequest(error)

  }

}

