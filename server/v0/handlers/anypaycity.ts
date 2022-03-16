import { models } from '../../../lib'

export async function show(req, h) {

  let account = await models.Account.findOne({

    where: { email: req.params.email }

  })

  if (account) {

    return h.redirect(`https://anypayx.com/app/#/pay/${account.id}`)

  } else {

    throw new h.badRequest(`${req.params.email} not registered with Anypay`)

  }

}
