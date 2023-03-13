
import { badRequest } from 'boom'

import { loadFromApp, WalletBot } from '../..'

export async function index(req, h) {
  
  const { app } = req

  const walletBot: WalletBot = await loadFromApp({ app })

  const balances = await walletBot.listLatestBalances()

  try {

    return { balances }

  } catch(error) {

    return badRequest(error)

  }

}

export async function show(req, h) {

  try {

    const { chain, currency, address } = req.params

    const { app } = req

    const walletBot: WalletBot = await loadFromApp({ app })

    const history = await walletBot.getAddressHistory({
      chain, currency, address
    })

    return { chain, currency, address, history }

  } catch(error) {

    return badRequest(error)

  }

}

export async function update(req, h) {

  const { chain, currency, address, balance } = req.payload

  const { app } = req

  const walletBot: WalletBot = await loadFromApp({ app })

  try {

    const [update, isChanged] = await walletBot.setAddressBalance({
      chain, currency, address, balance
    })

    return { update, isChanged }

  } catch(error) {

    return badRequest(error)

  }

}

