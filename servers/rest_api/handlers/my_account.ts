
import { logError } from '../../../lib/logger'

import { authorizeRequest } from '../auth/jwt'

export async function show(request, h) {

  try {

    let account = await authorizeRequest(request, h)

    return h.response({
      user: account.toJSON()
    })
    .code(200)

  } catch(error) {

    logError('myaccount.error', error)

    return h.response({ error: 'invalid access token' }).code(401)

  }

}

