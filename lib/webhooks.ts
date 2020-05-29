
import { models } from './models';
import { log } from './logger';

import * as http from 'superagent';

export async function sendWebhookForInvoice(invoiceUid: string, type: string = 'default') {

  let invoice = await models.Invoice.findOne({ where: {
    uid: invoiceUid
  }});

  var started_at = new Date();
  var invoice_uid = invoice.uid;
  var url = invoice.webhook_url;
  var response_code, response_body, ended_at, error;
  var resp;

  if (invoice.webhook_url) {

    try {

      let json = invoice.toJSON();

      resp = await http.post(invoice.webhook_url).send(json);

      response_code = resp.statusCode; 

      response_body = resp.body; 

      if (typeof resp.body !== 'string') {
        response_body = JSON.stringify(resp.body); 
      } else {
        response_body = resp.body; 
      }

      ended_at = new Date();

    } catch(e) {

      response_code = e.response.statusCode;

      if (typeof e.response.body !== 'string') {
        response_body = JSON.stringify(e.response.text); 
      } else {
        response_body = e.response.body; 
      }
      error = e.message;

      ended_at = new Date();

    }

    let webhook = await models.Webhook.create({
      started_at,
      invoice_uid,
      type,
      response_code,
      response_body,
      error,
      ended_at,
      url
    })

    return webhook;

  } else {

    throw new Error('no webhook_url set for invoice');

  }

}

