
import * as Joi from 'joi'

import { settings } from '../../../lib';

export async function update(request, h) {

  let currency = request.payload.denomination;

  let denomination = await settings.setDenomination(request.account.id, currency.toUpperCase());

  return h.response({
    success: true,
    denomination
  })

};

export async function show(request, h) {

  let denomination = await settings.getDenomination(request.account.id);

  return h.response({
    success: true,
    denomination
  })

};

export const DenominationUpdate = Joi.object({
  denomination: Joi.string()
}).label('DenominationUpdate');

