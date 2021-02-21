import { models } from '../../../lib'

export async function show(req, h) {

  let account = await models.Account.findOne({
    where: { email: req.params.email }
  })

  if (account) {

    return h.redirect(`https://app.anypayinc.com/pay/${account.id}`)

  } else {

    return `${req.params.email} Not Yet Registered With Anypay`

  }

}
