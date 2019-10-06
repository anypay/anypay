
import * as Boom from 'boom';

import { Request, ResponseToolkit } from 'hapi';

import { models, log } from '../../../lib';

export async function show(req: Request, h: ResponseToolkit) {

  log.info(`http.get.invoice_payment_options.${req.params.invoice_uid}`);

  try {

    let invoice = await models.Invoice.findOne({ where: {
      uid: req.params.invoice_uid
    }});

    if (!invoice) {

      throw new Error(`invoice ${req.params.invoice_uid} not found`);
    }

    let payment_options = await models.PaymentOption.findAll({ where: {
      invoice_uid: req.params.invoice_uid
    }});

    return {
      invoice,
      payment_options
    }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

