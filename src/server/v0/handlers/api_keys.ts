
import { ResponseToolkit } from '@hapi/hapi'
import { apikeys } from '@/lib'
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest'
import { Request } from '@hapi/hapi';

export async function index(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  let merchant_api_key = await apikeys.getMerchantApiKey((request as AuthenticatedRequest).account.id)

  let platform_api_key = await apikeys.getPlatformApiKey((request as AuthenticatedRequest).account.id)

  return {

    merchant_api_key,

    platform_api_key

  }

}
