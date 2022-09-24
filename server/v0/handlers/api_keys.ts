
import { apikeys } from '../../../lib'

export async function index(req, h) {

  let { uid: merchant_api_key } = await apikeys.getMerchantApiKey(req.account)

  let { uid: platform_api_key } = await apikeys.getPlatformApiKey(req.account)

  return {

    merchant_api_key,

    platform_api_key

  }

}
