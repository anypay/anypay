const Joi = require('joi');

import { settings } from '../../../lib';

module.exports.update = async function(request, h) {

  let currency = request.payload.denomination;

  let accountId = request.auth.credentials.accessToken.account_id;

  let denomination = await settings.setDenomination(accountId, currency.toUpperCase());

  return {
    success: true,
    denomination
  }

};

module.exports.show = async function(request, h) {

  let accountId = request.auth.credentials.accessToken.account_id;

  let denomination = await settings.getDenomination(accountId);

  return {
    success: true,
    denomination
  }

};

module.exports.DenominationUpdate = Joi.object({
  denomination: Joi.string()
}).label('DenominationUpdate');

