
import { models } from '../../../lib';

import * as Boom from 'boom';

export async function show(req, h) {
  
  try {

    let payment_options = await models.PaymentOption.findAll({
      where: {
        invoice_uid: req.params.invoice_uid
      }
    });

    return { payment_options }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

