
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest'
import { apikeys } from '@/lib'
import { Request } from '@hapi/hapi'

export async function index(request: AuthenticatedRequest | Request) {

  let merchant_api_key = await apikeys.getMerchantApiKey((request as AuthenticatedRequest).account.id)

  return {

    'v0': merchant_api_key

  }

}

