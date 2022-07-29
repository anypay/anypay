
import { models } from '../../../lib';

export async function show(req) {
  
  let payment_options = await models.PaymentOption.findAll({
    where: {
      invoice_uid: req.params.invoice_uid
    }
  });

  return { payment_options }

}

