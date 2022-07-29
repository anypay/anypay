
import { models } from '../../../lib'

export async function create(req) { 

  let [krakenAccount] = await models.KrakenAccount.findOrCreate({
    where: {
      account_id: req.account.id
    },
    defaults: {
      api_key: req.payload.api_key,
      api_secret: req.payload.api_secret,
      account_id: req.account.id
    }
  })

  krakenAccount.api_key = req.payload.api_key
  krakenAccount.api_secret = req.payload.api_secret

  await krakenAccount.save()

  return {
    api_key: krakenAccount.api_key,
    api_secret: 'xxxxxxxxxxxxxx'
  }

}

export async function show(req) { 

  let krakenAccount = await models.KrakenAccount.findOne({
    where: {
      account_id: req.account.id
    },
  })

  if (!krakenAccount) {

    return {
      api_key: null,
      api_secret: null
    }

  } else {

    return {
      api_key: krakenAccount.api_key,
      api_secret: 'xxxxxxxxxxxxxx'
    }
  }

}

export async function destroy(req) { 

  let krakenAccount = await models.KrakenAccount.findOne({
    where: {
      account_id: req.account.id
    },
  })

  if (krakenAccount) {
    await krakenAccount.destroy()
  }

  return { success: true }

}

