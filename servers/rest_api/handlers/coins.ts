import {accounts}  from '../../../lib';

import * as Joi from 'joi';

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
 *         "enabled": false,
 *         "supported": true
 *       },{
 *        "code": "DASH",
 *        "name": "dash",
 *        "enabled": true,
 *         "supported": false
 *       }]
 *     }
 */
module.exports.list = async function(request, reply) {

  let accountId = request.auth.credentials.accessToken.account_id;

  let accountCoins = await accounts.getSupportedCoins(accountId);

  let coins = Object.values(accountCoins);

  return {
    'coins': sortBCHFirst(coins)
  };
}

function sortBCHFirst(data) {

  data.sort(function(x,y){ return x.code == 'BCH' ? -1 : y.code == 'BCH' ? 1 : 0; });

  return data
}

const Coin = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  enabled: Joi.boolean().required(),
  supported: Joi.boolean().required(),
}).label('Coin')

module.exports.CoinsIndexResponse = Joi.object({
  coins: Joi.array().items(Coin).label('Coins')
}).label('CoinsIndexResponse');
