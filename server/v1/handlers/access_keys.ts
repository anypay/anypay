
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'
import { apikeys } from '../../../lib'

export async function index(request: AuthenticatedRequest) {

  let merchant_api_key = await apikeys.getMerchantApiKey(request.account.id)

  return {

    'v0': merchant_api_key

  }

}

