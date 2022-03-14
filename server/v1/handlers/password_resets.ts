
import { passwordResetEmail } from '../../../lib/password_reset'

import { log } from '../../../lib/log'

export async function create(request, h) {

  try {

    await passwordResetEmail(request.payload.email)

    return h.response({

      success: true

    }).code(200)

  } catch(error) {

    log.error('account.registration.error', error);

    return h.response({ error: error.message }).code(500)

  }
}

