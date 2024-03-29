import { Request, ResponseToolkit } from '@hapi/hapi'
import prisma from '../../../lib/prisma'

export async function show(request: Request, h: ResponseToolkit) {

  const account = await prisma.accounts.findFirst({
    where: {
      email: request.params.email
    }
  })

  if (account) {

    return h.redirect(`https://app.anypayinc.com/pay/${account.id}`)

  } else {

    return `${request.params.email} Not Yet Registered With Anypay`

  }

}
