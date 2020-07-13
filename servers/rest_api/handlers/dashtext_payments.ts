
import { models } from '../../../lib';
import * as dashtext from '../../../lib/dash/dashtext';

export async function create(req, h) {

  let invoice = await models.Invoice.findOne({ where: {
  
    uid: req.params.uid

  }})

  let account = await models.Account.findOne({ where: {

    id: invoice.account_id

  }});

  if (account.dash_text_enabled) {

    let code = await dashtext.generateCode(
      invoice.address,
      invoice.invoice_amount,
      invoice.uid
    );

    return code;

  } else {

    return {
      resp: "AccountUnsupported",
      error: "account does not have dash text enabled",
      success: false
    }

  }

}

