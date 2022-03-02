
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

    console.log('error', error)

    logError('account.registration.error', { error: 'registration error' });

    return h.response({ error: 'registration error' }).code(400)

  }
}

