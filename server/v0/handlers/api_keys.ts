
import { ResponseToolkit } from '@hapi/hapi'
import { apikeys } from '../../../lib'
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'

export async function index(request: AuthenticatedRequest, h: ResponseToolkit) {

  let merchant_api_key = await apikeys.getMerchantApiKey(request.account.id)

  let platform_api_key = await apikeys.getPlatformApiKey(request.account.id)

  return {

    merchant_api_key,

    platform_api_key

  }

}
