
import * as Joi from '@hapi/joi'

import { settings } from '../../../lib';

export async function update(request, h) {

  let currency = request.payload.denomination;

  let accountId = request.auth.credentials.accessToken.account_id;

  let denomination = await settings.setDenomination(accountId, currency.toUpperCase());

  return {
    success: true,
    denomination
  }

};

export async function show(request, h) {

  let accountId = request.auth.credentials.accessToken.account_id;

  let denomination = await settings.getDenomination(accountId);

  return {
    success: true,
    denomination
  }

};

export const DenominationUpdate = Joi.object({
  denomination: Joi.string()
}).label('DenominationUpdate');

