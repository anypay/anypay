import { Request, ResponseToolkit } from '@hapi/hapi'
import { models } from '../../../lib'

export async function show(request: Request, h: ResponseToolkit) {

  let account = await models.Account.findOne({
    where: { email: request.params.email }
  })

  if (account) {

    return h.redirect(`https://app.anypayinc.com/pay/${account.id}`)

  } else {

    return `${request.params.email} Not Yet Registered With Anypay`

  }

}
