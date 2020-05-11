require('dotenv').config();

import * as http from 'superagent'

import { models } from './models';

export async function generateCodeForInvoice(uid: string) {

  let invoice = await models.Invoice.findOne({ where: { uid }});

  if (!invoice) {
    throw new Error(`Invoice ${uid} not found`);
  }
 
  let account = await models.Account.findOne({ where: { id: invoice.account_id }});

  if (!account) {
    throw new Error(`Account ${invoice.accound_id} not found`);
  }

  if (!account.google_place_id) {
    throw new Error('Account does not yet have a google_place_id');
  }

  let resp = await http
        .post('https://truereviews.io/api/anypay/token')
        .set('trApiKey', process.env.TRUEREVIEWS_API_KEY)
        .send({
          data: {
            location: account.google_place_id,
            invoice_uid: invoice.uid
          },
          amount: `${invoice.denomination_amount_paid}`
        })

  return resp.body;

}

