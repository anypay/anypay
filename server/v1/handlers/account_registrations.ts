
import { geolocateAccountFromRequest, registerAccount } from '../../../lib/registration'

import { ensureAccessToken } from '../../../lib/access_tokens'

export async function create(request, h) {

  const account = await registerAccount(request.payload)

  geolocateAccountFromRequest(account, request)

  const { accessToken } = await ensureAccessToken(account)

  return h.response({

    user: account.toJSON(),

    accessToken

  }).code(201)

}

