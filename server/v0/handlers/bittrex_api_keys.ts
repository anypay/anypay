
import { models } from '../../../lib'

export async function create(req) { 

  let [bittrexAccount] = await models.BittrexAccount.findOrCreate({
    where: {
      account_id: req.account.id
    },
    defaults: {
      api_key: req.payload.api_key,
      api_secret: req.payload.api_secret,
      account_id: req.account.id
    }
  })

  bittrexAccount.api_key = req.payload.api_key
  bittrexAccount.api_secret = req.payload.api_secret

  await bittrexAccount.save()

  return {
    api_key: bittrexAccount.api_key,
    api_secret: 'xxxxxxxxxxxxxx'
  }

}

export async function show(req) { 

  let bittrexAccount = await models.BittrexAccount.findOne({
    where: {
      account_id: req.account.id
    },
  })

  if (!bittrexAccount) {

    return {
      api_key: null,
      api_secret: null
    }

  } else {

    return {
      api_key: bittrexAccount.api_key,
      api_secret: 'xxxxxxxxxxxxxx'
    }
  }

}

export async function destroy(req) { 

  let bittrexAccount = await models.BittrexAccount.findOne({
    where: {
      account_id: req.account.id
    },
  })

  if (bittrexAccount) {
    await bittrexAccount.destroy()
  }

  return { success: true }

}

