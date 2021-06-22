import { sendWebhookForInvoice } from '../../../lib/webhooks';

import * as Boom from 'boom';

export async function create(req, h) {

  try {

    let record = await sendWebhookForInvoice(req.params.uid, 'sudo_api');

    return { webhook: record.toJSON() };

  } catch(err) {

    console.log(err)

    return Boom.badRequest(err.message);

  }

}

