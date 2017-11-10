const Account = require("../../../lib/models/account");
const _ = require('underscore');

function CoinsFromAccount(account) {
  var coins = {
    'BTC': {
      code: 'BTC',
      name: 'bitcoin',
      enabled: false
    },
    'DASH': {
      code: 'DASH',
      name: 'dash',
      enabled: false
    }
  };

  if (account.bitcoin_payout_address) {
    coins['BTC'].enabled = true;
  }

  if (account.dash_payout_address) {
    coins['DASH'].enabled = true;
  }

  return coins;
}

/**
 * @api {get} /coins Request User Supported Coins
 * @apiName GetCoins
 * @apiGroup Coin
 *
 * @apiError AccountNotFound No Account was found with access_token provided
 *
 * @apiSuccess {String} code Currency code of the coin
 * @apiSuccess {String} name Display name of currency in English
 * @apiSuccess {Boolean} enabled false if account support for coin is disabled
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "coins": [{
 *         "code": "BTC",
 *         "name": "bitcoin",
 *         "enabled": false
 *       },{
 *        "code": "DASH",
 *        "name": "dash",
 *        "enabled": true
 *       }]
 *     }
 */
module.exports.list = function(request, reply) {

  let accountId = request.auth.credentials.accessToken.account_id;


  Account.find({ where: { id: accountId }}).then(account => {

    let accountCoins = CoinsFromAccount(account);

    reply({
      'coins': _.values(accountCoins)
    });
  })
  .catch(error => {
    reply({ error: error.message }).code(500);
  });
}

