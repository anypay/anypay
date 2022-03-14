
import { log } from '../../../lib/log'

export async function show(request, h) {

  try {

    return h.response({

      user: request.account.toJSON()

    })
    .code(200)

  } catch(error) {

    log.error('myaccount.error', error)

    return h.response({ error: 'invalid access token' }).code(401)

  }

}

