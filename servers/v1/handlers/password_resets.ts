
import { passwordResetEmail } from '../../../lib/password_reset'

import { logError } from '../../../lib/logger'

export async function create(request, h) {

  try {

    await passwordResetEmail(request.payload.email)

    return h.response({

      success: true

    }).code(200)

  } catch(error) {

    console.log(error)

    logError('account.registration.error', { error });

    return h.response({ error: error.message }).code(500)

  }
}

