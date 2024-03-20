
import { geolocateAccountFromRequest, registerAccount } from '../../../lib/accounts/registration'

import { ensureAccessToken } from '../../../lib/access_tokens'
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'
import { ResponseToolkit } from '@hapi/hapi'

export async function create(request: AuthenticatedRequest, h: ResponseToolkit) {

  const account = await registerAccount(request.payload as {
    email: string,
    password: string
  
  })

  geolocateAccountFromRequest(account, request)

  const accessToken = await ensureAccessToken(account)

  return h.response({

    user: account,

    accessToken

  }).code(201)

}

