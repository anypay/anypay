

import { resetPasswordByEmail, sendPasswordResetEmail } from '@/lib/password';

import * as Joi from 'joi'

import { Request } from '@hapi/hapi';
import prisma from '@/lib/prisma';

export async function reset (request: Request) {

  const { email } = request.payload as { email: string }

  await sendPasswordResetEmail(email);

  return { success: true };

}

export async function claim(request: Request) {


  const passwordReset = await prisma.password_resets.findFirst({
    where: {
      uid: request.params.uid
    }
  })

  if (!passwordReset) {
    return { success: false }
  }

  const { password } = request.payload as { password: string }

  await resetPasswordByEmail(String(passwordReset.email), password);

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

