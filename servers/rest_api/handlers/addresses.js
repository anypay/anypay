const BitcoinInvoice = require("../../../lib/bitcoin/invoice");
const Account = require("../../../lib/models/account");
const Boom = require('boom');
const Joi = require('joi');

module.exports.list = async function(request, reply) {

  let accountId = request.auth.credentials.accessToken.account_id;

  let account = await Account.find({ where: { id: accountId }})

  return {
    'BTC': account.bitcoin_payout_address,
    'DASH': account.dash_payout_address,
    'BCH': account.bitcoin_cash_address
  };
};

module.exports.update = async function(request, reply) {
  let currency = request.params.currency;
  let address = request.payload.address;
  let accountId = request.auth.credentials.accessToken.account_id;

  var updateParams;

  switch(currency) {
  case 'DASH':
    updateParams = {
      dash_payout_address: address
    };
    break; 
  case 'BTC':
    updateParams = {
      bitcoin_payout_address: address
    };
    break; 
  case 'BCH':
    updateParams = {
      bitcoin_cash_address: address
    };
    break; 
  case 'LTC':
    updateParams = {
      litecoin_address: address,
      litecoin_enabled: true
    };
    break;
  case 'XRP':
    updateParams = {
      ripple_address: address
    };
    break;
  case 'DOGE':
    updateParams = {
      dogecoin_address: address,
      dogecoin_enabled: false
    };
    break;
  default:
  }

  if (!updateParams) {

    return Boom.badRequest('valid currency and address must be provided');

  } else {
    var invoice = await Account.update(updateParams, {where: { id: accountId }})

    return invoice;
  }
}

module.exports.PayoutAddresses = Joi.object({
  BTC: Joi.string(),
  DASH: Joi.string(),
  BCH: Joi.string(),
}).label('PayoutAddresses');

module.exports.PayoutAddressUpdate = Joi.object({
  address: Joi.string().required(),
}).label('PayoutAddressUpdate');
