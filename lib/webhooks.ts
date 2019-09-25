
import { models } from './models';
import { log } from './logger';

import * as http from 'superagent';

export async function sendWebhookForInvoice(invoiceUid: string) {

  let invoice = await models.Invoice.findOne({ where: {
    uid: invoiceUid
  }});

  if (invoice.webhook_url) {

    let json = invoice.toJSON();

    let resp = await http.post(invoice.webhook_url).send(json);

    return resp;

  } else {

    throw new Error('no webhook_url set for invoice');

  }


}

