const password = require("../../../lib/password")

import { models } from '../../../lib';

export async function reset (request, h) {

  await password.sendPasswordResetEmail(request.payload.email);

  return { success: true };

}

export async function claim(request, h) {

  let passwordReset = await models.PasswordReset.findOne({ where:
    { uid: request.params.uid }
  })

  if (!passwordReset) {
    return h.notFound()
  }

  await password.resetPasswordByEmail(passwordReset.email, request.payload.password);

  return { success: true };

}
