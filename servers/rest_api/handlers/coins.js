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
    },
    'BCH': {
      code: 'BCH',
      name: 'bitcoin cash',
      enabled: false
    },
    'LTC': {
      code: 'LTC',
      name: 'litecoin',
      enabled: false
    },
    'DOGE': {
      code: 'DOGE',
      name: 'dogecoin',
      enabled: false
    }
  };

  if (account.bitcoin_payout_address) {
    coins['BTC'].enabled = true;
  }

  if (account.dash_payout_address) {
    coins['DASH'].enabled = true;
  }

  // Ensure extra flag for beta release of bitcoin cash
  // TODO Remove the bitcoin_cash_enabled account flag once fully supported
  if (account.bitcoin_cash_address && account.bitcoin_cash_enabled) {
    coins['BCH'].enabled = true;
  }

  // Ensure extra flag for beta release of litecoin
  // TODO Remove the litecoin_enabled account flag once fully supported
  if (account.litecoin_address && account.litecoin_enabled) {
    coins['LTC'].enabled = true;
  }

  if (account.dogecoin_address && account.dogecoin_enabled) {
    coins['DOGE'].enabled = true;
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

