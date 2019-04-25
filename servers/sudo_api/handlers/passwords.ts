
import * as password from '../../../lib/password';

import * as Boom from 'boom';

import { log, models } from '../../../lib';

export async function update(req, h) {

  if (req.payload.password !== req.payload.password_confirmation) {

    return Boom.badRequest('password must match password_confirmation');
  }

  let account = await models.Account.findOne({ where: { id: req.params.account_id }});

  if (!account) {

    return Boom.badRequest(`account ${req.params.account_id} not found`);

  }

  try {

    await password.resetPasswordByEmail(account.email, req.payload.password);

    return { success: true }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

