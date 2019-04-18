
import { authCoinOracle } from '../../../lib/coin_oracles';

import * as Boom from 'boom';

export async function httpAuthCoinOracle(request, username, password, h) {

  var coin;

  if (request.payload && request.payload.currency) {

    coin = request.payload.currency;

  } else if (request.params.coin) {

    coin = request.params.coin;

  }

  let authenticated = await authCoinOracle(coin, username);

  if (authenticated) {

    return {

      isValid: authenticated,

      credentials: {

        coin: coin

      }

    }

  } else {

    return Boom.badRequest(`oracle not autheneticated for coin ${coin}`)

    /*
    return {

      isValid: false

    }
    */

  }


}

