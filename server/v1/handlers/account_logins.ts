
import { badRequest } from 'boom'

import { loginAccount, geolocateAccountFromRequest } from '../../../lib/accounts/registration'

import { ensureAccessToken } from '../../../lib/access_tokens'

import { log } from '../../../lib/log'

export async function create(request, h) {

  var account;

  try {

    account = await loginAccount(request.payload)

  } catch(error) {

    log.error('login.error', error)

    return h.response({ error: error.message }).code(401)

  }

  geolocateAccountFromRequest(account, request)

  const token = await ensureAccessToken(account);

  const { accessToken } = await ensureAccessToken(account)

  return h.response({

    user: account.toJSON(),

    accessToken,

  }).code(200)

}

