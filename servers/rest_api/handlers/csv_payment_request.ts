
import { createPaymentRequestFromCsv } from '../../../lib/csv_payment_requests';

import * as http from 'superagent';

import * as Boom from 'boom';

export async function show(req, h) {

  console.log(req.query.csv_url);

  try { 

    let resp = await http.get(req.query.csv_url);

    console.log(resp.text);

    let request = await createPaymentRequestFromCsv(resp.text);

    return request;

  } catch(error) {

    return Boom.badRequest(error.message);
  }

}

