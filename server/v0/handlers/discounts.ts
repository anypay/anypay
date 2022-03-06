
import { discount, log } from '../../../lib';

import { badRequest } from 'boom'

export async function update(req, h) {

  try {

    await discount.set({
      account_id: req.account.id,
      currency: req.params.currency,
      percent: req.payload.percent
    })

  } catch(error) {

    return badRequest(error)

  }

}
