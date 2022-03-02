
import { Orm } from './orm'

import { models } from './models'

import { sendPasswordResetEmail } from './password'

export class PasswordReset extends Orm {

}

export async function passwordResetEmail(email: string): Promise<PasswordReset> {

  let record = await models.PasswordReset.create({ email })

  await sendPasswordResetEmail(email)

  return new PasswordReset(record)

}

