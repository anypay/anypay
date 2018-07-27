import {Account}  from '../../../lib/models';

import {getSupportedCoins} from '../../../lib/accounts';

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
 *         "enabled": false
 *       },{
 *        "code": "DASH",
 *        "name": "dash",
 *        "enabled": true
 *       }]
 *     }
 */
module.exports.list = async function(request, reply) {

  let accountId = request.auth.credentials.accessToken.account_id;

  let accountCoins = await getSupportedCoins(accountId);

  return {
    'coins': Object.values(accountCoins)
  };
}

const Coin = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  enabled: Joi.boolean().required(),
}).label('Coin')

module.exports.CoinsIndexResponse = Joi.object({
  coins: Joi.array().items(Coin).label('Coins')
}).label('CoinsIndexResponse');
