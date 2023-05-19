
import { loadWallet, getBitcore } from './simple-wallet/src'

export { getBitcore } 

import { Card, Wallet } from './simple-wallet/src/wallet';

export { Card, Wallet }

import { MnemonicWallet } from './mnemonic_wallet';

import config from './config';

export async function load(): Promise<Wallet> {

  const mnemonic = config.get('wallet_bot_backup_seed_phrase')

  const mnemonicWallet = new MnemonicWallet(mnemonic)

  const cards = mnemonicWallet.wallets.map(wallet => {

    const card: Card = new Card({
      asset: wallet.asset,
      privatekey: wallet.privatekey,
      address: wallet.address
    })

    return card

  })

  /*const card = cards.filter(card => card.asset === 'DASH')[0]

  return loadWallet([card])
  */

  return loadWallet(cards)

}

