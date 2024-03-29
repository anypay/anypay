
import { badRequest } from 'boom'

import { Request, ResponseToolkit } from '@hapi/hapi'

import { getAddressHistory, listLatestBalances, loadFromApp, setAddressBalance } from '../..'

export async function index(req: Request, h: ResponseToolkit) {
  
  const { app }: { app: any } = req as any

  const walletBot = await loadFromApp({ app })

  const balances = await listLatestBalances(walletBot)

  try {

    return h.response({ balances })

  } catch(error: any) {

    return badRequest(error)

  }

}

export async function show(req: Request, h: ResponseToolkit) {

  try {

    const { chain, currency, address } = req.params as any

    const { app }: { app: any } = req as any

    const walletBot: any = await loadFromApp({ app })

    const history = await getAddressHistory(walletBot, {
      chain, currency, address
    })

    return { chain, currency, address, history }

  } catch(error: any) {

    return badRequest(error)

  }

}

export async function update(req: Request, h: ResponseToolkit) {

  const { chain, currency, address, balance } = req.payload as any

  const { app }: { app: any } = req as any

  const walletBot: any = await loadFromApp({ app })

  try {

    const [update, isChanged] = await setAddressBalance(walletBot, {
      chain, currency, address, balance
    })

    return { update, isChanged }

  } catch(error: any) {

    return badRequest(error)

  }

}

