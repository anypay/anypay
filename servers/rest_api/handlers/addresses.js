const BitcoinInvoice = require("../../../lib/bitcoin/invoice");
const Account = require("../../../lib/models/account");

/**
 * @api {GET} /addresses List Payout Addresses
 * @apiName ListAddresses
 * @apiGroup Addresses
 *
 * @apiSuccess {String} BTC Bitcoin Payout Address
 * @apiSuccess {String} DASH Dash Payout Address
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {BTC: "1LpXN6ijVs7or8eDrcywnqK8WvRNFRAfo1", DASH: "XatPMnCbQR8EHy2Mg9b67jjQhLbuLRtwBR"}
 *      BTC: "1LpXN6ijVs7or8eDrcywnqK8WvRNFRAfo1"
 *      DASH: "XatPMnCbQR8EHy2Mg9b67jjQhLbuLRtwBR"
 *
 * @apiError 404 NoAddressesFound No address was found for user
 */

module.exports.list = function(request, reply) {


  let accountId = request.auth.credentials.accessToken.account_id;
  console.log('LIST', accountId);

  Account.find({ where: { id: accountId }})
    .then(account => {
        console.log('found account', account);
      reply({
        'BTC': account.bitcoin_payout_address,
        'DASH': account.dash_payout_address
      });
    })
    .catch(error => {
      reply({ error: error.message }).code(500);
    });
}

/**
 * @api {put} /addresses/{currency} Update Payout Address
 * @apiName UpdateAddresses
 * @apiGroup Addresses
 *
 * @apiParam {String} address New Payout Address
 *
 * @apiSuccess {Integer} updated 1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       0: 1
 *     }
 */

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
