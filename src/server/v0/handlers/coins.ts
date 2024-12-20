import {accounts} from '@/lib';

import * as Joi from 'joi';
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest';
import { ResponseToolkit } from '@hapi/hapi';
import { find } from '@/lib/plugins';
import { Request } from '@hapi/hapi';
type Coin = {
    currency: string
    chain: string
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

export async function list(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  let accountCoins = await accounts.getSupportedCoins((request as AuthenticatedRequest).account.id);

  let coins = Object.values(accountCoins).map((coin: Coin) => {

      if (coin.chain && coin.currency) {

        const plugin = find({currency: coin.currency, chain: coin.chain})

        return ({...coin, decimals: plugin.decimals})

      } else {

        return ({...coin, decimals: 0})

      }

  });

  return h.response({
    'coins': sortBCHFirst(coins)
  })
}

function sortBCHFirst(data: { currency: string }[]) {

  data.sort(function(x,y){ return x.currency == 'BCH' ? -1 : y.currency == 'BCH' ? 1 : 0; });

  return data
}

const Coin = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  enabled: Joi.boolean().required(),
  supported: Joi.boolean().required(),
}).label('Coin')

export const CoinsIndexResponse = Joi.object({
  coins: Joi.array().items(Coin).label('Coins')
}).label('CoinsIndexResponse');

