
import { models } from '../../../lib';

import { badRequest } from 'boom';

export async function index(req, h) {

  try {

    let kraken_invoice_sell_orders = await models.KrakenInvoiceSellOrder.findAll();

    return { kraken_invoice_sell_orders }

  } catch(error) {

    console.log(error);

    return badRequest(error.message);

  }

}

