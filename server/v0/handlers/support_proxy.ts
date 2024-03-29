
import { Request, ResponseToolkit } from '@hapi/hapi'
import { log } from '../../../lib'

import  * as slack from '../../../lib/slack'
import prisma from '../../../lib/prisma'

export async function show(request: Request, h: ResponseToolkit) {

  const accessToken = await prisma.access_tokens.findFirstOrThrow({
    where: {
      uid: request.params.token
    }
  })

  const account = await prisma.accounts.findFirstOrThrow({
    where: {
      id: accessToken.account_id
    }
  })

  log.info(`linktracker.payscreen.help`, {
    account: account,
    access_token_id: accessToken
  })

  slack.notify(`${account.email} is having trouble paying!`)

  slack.notify(`linktracker.payscreen.help ${JSON.stringify({
    access_token_id: accessToken.id,
    email: account.email
  })}`, 'events')

  return h.redirect(`https://anypayx.com/pay`)

}
