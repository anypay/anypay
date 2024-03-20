
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'
import { passwordResetEmail } from '../../../lib/password_reset'
import { ResponseToolkit } from '@hapi/hapi'

export async function create(request: AuthenticatedRequest, h: ResponseToolkit) {

  const { email } = request.payload as { email: string }

  await passwordResetEmail(email)

  return h.response({

    success: true

  }).code(200)

}

