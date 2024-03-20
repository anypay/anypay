
import { models } from '../../../lib'
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'

export async function create(request: AuthenticatedRequest) { 

  const payload = request.payload as {
    api_key: string
    api_secret: string
  }

  let [krakenAccount] = await models.KrakenAccount.findOrCreate({
    where: {
      account_id: request.account.id
    },
    defaults: {
      api_key: payload.api_key,
      api_secret: payload.api_secret,
      account_id: request.account.id
    }
  })

  krakenAccount.api_key = payload.api_key
  krakenAccount.api_secret = payload.api_secret

  await krakenAccount.save()

  return {
    api_key: krakenAccount.api_key,
    api_secret: 'xxxxxxxxxxxxxx'
  }

}

export async function show(request: AuthenticatedRequest) { 

  let krakenAccount = await models.KrakenAccount.findOne({
    where: {
      account_id: request.account.id
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

export async function destroy(request: AuthenticatedRequest) { 

  let krakenAccount = await models.KrakenAccount.findOne({
    where: {
      account_id: request.account.id
    },
  })

  if (krakenAccount) {
    await krakenAccount.destroy()
  }

  return { success: true }

}

