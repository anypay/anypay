
import * as Boom from 'boom';

import { apikeys } from '../../../lib'

import { log } from '../../../lib/log'

export async function index(req, h) {

  try {

    let merchant_api_key = await apikeys.getMerchantApiKey(req.account.id)
    let platform_api_key = await apikeys.getPlatformApiKey(req.account.id)

    return {
      merchant_api_key,
      platform_api_key
    }

  } catch(error) {

    log.error('servers.rest_api.controllers.api_keys.index.error', error)

    return Boom.badRequest(error.message)

  }

}
