
import { loginAccount, geolocateAccountFromRequest } from '@/lib/accounts/registration'

import { ensureAccessToken } from '@/lib/access_tokens'

import { log } from '@/lib/log'
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { generateAccountToken } from '@/lib/jwt';

export async function create(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  var account;

  try {

    account = await loginAccount(request.payload as {
        
        email: string,
  
        password: string,
  
      
    })

  } catch(error: any) {

    log.error('login.error', error)

    return h.response({ error: error.message }).code(401)

  }

  geolocateAccountFromRequest(account, request)

  const accessToken = await ensureAccessToken(account)

  const jwt: string = await generateAccountToken({
    account_id: account.id,
    uid: String(accessToken.uid)
  })

  return h.response({

    user: account,

    accessToken: jwt,

  }).code(200)

}

