
import { log, models } from '../../../lib'

import { badRequest } from 'boom'

export async function show(req, h) {

  try {

    log.info(`support.proxy.pay`)

    let accessToken = await models.AccessToken.findOne({ where: { uid: req.params.token }})

    let account = await models.Account.findOne({ where: { id: accessToken.account_id }})

    log.info(`support.proxy.pay`, {
      access_token_id: accessToken,
      account: account.toJSON()
    })

  } catch(error) {

    log.error(`support.proxy.pay`, {
      error: error.message,
      access_token: req.token,
    })

  }

  return h.redirect(`https://anypayinc.com/pay`)

}
