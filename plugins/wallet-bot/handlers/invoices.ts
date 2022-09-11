
import { models, log } from '../../../lib'

import { badRequest } from 'boom'

interface Amount {
  currency: string;
  value: number;
}

interface Invoice {
  amount: Amount,
  uid: string;
  status: string;
  uri: string;
}

function formatInvoice(invoice: any): Invoice {

  return {
    amount: {
      currency: invoice.denomination,
      value: invoice.denomination_amount
    },
    uid: invoice.uid,
    uri: invoice.uri,
    status: invoice.status
  }

}

export async function index(req, h) {

  try {

    let invoices = await models.Invoice.findAll({

      where: {

        status: req.params.status || 'unpaid',

        app_id: req.app_id

      }

    })

    invoices = invoices.map(invoice => formatInvoice(invoice))

    return {

      invoices

    }

  } catch (error) {

    log.error('plugins.wallet-bot.handlers.invoices.index', error)

    throw badRequest(error)

  }

}
