const password = require("../../../lib/password")
const Joi = require('joi');

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
    return { success: false }
  }

  await password.resetPasswordByEmail(passwordReset.email, request.payload.password);

  return { success: true };

}

export const PasswordReset = Joi.object({
  email: Joi.string().required(),
}).label('PasswordReset');

export const PasswordResetClaim = Joi.object({
  password: Joi.string().min(1).required(),
}).label('PasswordResetClaim');

export const PasswordResetResponse = Joi.object({
  success: Joi.boolean().required(),
  error: Joi.string(),
}).label('PasswordResetResponse');

