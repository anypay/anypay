const BitcoinInvoice = require("../../../lib/bitcoin/invoice");
const Account = require("../../../lib/models/account");
const Boom = require('boom');

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

