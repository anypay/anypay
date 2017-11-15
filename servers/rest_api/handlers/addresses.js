const BitcoinInvoice = require("../../../lib/bitcoin/invoice");
const Account = require("../../../lib/models/account");

module.exports.list = function(request, reply) {


  let accountId = request.auth.credentials.accessToken.account_id;

  Account.find({ where: { id: accountId }})
    .then(account => {

      reply({
        'BTC': account.bitcoin_payout_address,
        'DASH': account.dash_payout_address,
        'BCH': account.bitcoin_cash_address
      });
    })
    .catch(error => {
      reply({ error: error.message }).code(500);
    });
}

module.exports.update = function(request, reply) {
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
  default:
  }

  if (!updateParams) {
    reply({ error: 'valid currency and address must be provided' }).code(500);
    return;
  } else {
    Account.update(updateParams, {where: { id: accountId }})
      .then(invoice => {
        reply(invoice);
      })
      .catch(error => {
        reply({ error: error.message }).code(500);
      });
  }
}

