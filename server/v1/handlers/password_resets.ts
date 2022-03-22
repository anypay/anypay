
import { passwordResetEmail } from '../../../lib/password_reset'

import { log } from '../../../lib/log'

export async function create(request, h) {

  await passwordResetEmail(request.payload.email)

  return h.response({

    success: true

  }).code(200)

}

