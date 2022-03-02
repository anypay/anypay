
import { badRequest } from 'boom'

import { geolocateAccountFromRequest, registerAccount } from '../../../lib/accounts/registration'

import { ensureAccessToken } from '../../../lib/access_tokens'

import { logError } from '../../../lib/logger'

export async function create(request, h) {

  try {

    const account = await registerAccount(request.payload)

    geolocateAccountFromRequest(account, request)

    const { accessToken } = await ensureAccessToken(account)

    return h.response({

      user: account.toJSON(),

      accessToken

    }).code(201)

  } catch(error) {

    console.log(error)

    logError('account.registration.error', { error });

    return badRequest(error);

  }
}

