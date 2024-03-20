
import { Request, ResponseToolkit } from '@hapi/hapi'
import { log, models } from '../../../lib'

import  * as slack from '../../../lib/slack'

export async function show(request: Request, h: ResponseToolkit) {

  let accessToken = await models.AccessToken.findOne({ where: { uid: request.params.token }})

  let account = await models.Account.findOne({ where: { id: accessToken.account_id }})

  log.info(`linktracker.payscreen.help`, {
    account: account.toJSON(),
    access_token_id: accessToken
  })

  slack.notify(`${account.email} is having trouble paying!`)

  slack.notify(`linktracker.payscreen.help ${JSON.stringify({
    access_token_id: accessToken.id,
    email: account.email
  })}`, 'events')

  return h.redirect(`https://anypayx.com/pay`)

}
