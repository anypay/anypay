
import { Request, ResponseToolkit } from '@hapi/hapi';
import { models } from '../../../lib';

export async function show(request: Request, h: ResponseToolkit) {
  
  let payment_options = await models.PaymentOption.findAll({
    where: {
      invoice_uid: request.params.invoice_uid
    }
  });

  return { payment_options }

}

