
import { passwordResetEmail } from '../../../lib/password_reset'

export async function create(request, h) {

  await passwordResetEmail(request.payload.email)

  return h.response({

    success: true

  }).code(200)

}

