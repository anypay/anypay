import { MnemonicWallet } from './mnemonic_wallet'

export { MnemonicWallet } from './mnemonic_wallet'

export { connect } from './socket.io'

import config from './config'

import { log } from './log'

export { log } from './log'

import { loadWallet, Wallet } from './wallet'

import { Card } from './card'

export { Card } from './card'

export { config }

export { Wallet, loadWallet }

export async function initWalletFromMnemonic(): Promise<Wallet> {

  const mnemonic = config.get('wallet_bot_backup_seed_phrase')

  if (!mnemonic) {

    const error = new Error('no wallet_bot_backup_seed_phrase config variable set')

    log.error('config.env.invalid', error)

    throw error

  }

  const { cards }: { cards: Card[] } = MnemonicWallet.init(mnemonic)

  const wallet: Wallet = new Wallet({ cards })

  return wallet

}

