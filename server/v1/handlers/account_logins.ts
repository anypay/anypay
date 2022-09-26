
import { loginAccount, geolocateAccountFromRequest } from '../../../lib/registration'

import { ensureAccessToken } from '../../../lib/access_tokens'

import { log } from '../../../lib/log'

export async function create(request, h) {

  var account;

  try {

    account = await loginAccount(request.payload)

    console.log("__LOGIN", account)

  } catch(error) {

    log.error('login.error', error)

    return h.response({ error: error.message }).code(401)

  }

  geolocateAccountFromRequest(account, request)

  const { accessToken } = await ensureAccessToken(account)

  return h.response({

    user: account.toJSON(),

    accessToken,

  }).code(200)

}

