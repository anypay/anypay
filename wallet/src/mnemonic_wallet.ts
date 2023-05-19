
const bip39 = require('bip39');

import { Card } from './card'

import DOGE from './cards/doge'

import BTC from './cards/btc'

import BCH from './cards/bch'

import BSV from './cards/bsv'

import LTC from './cards/ltc'

import DASH from './cards/dash'

import XMR from './cards/xmr'

import MATIC from './cards/matic'

import AVAX from './cards/avax'

import ETH from './cards/eth'

import SOL from './cards/sol'

import USDC_MATIC from './cards/usdc_matic'

import USDC_AVAX from './cards/usdc_avax'

import USDC_ETH from './cards/usdc_eth'

import USDC_SOL from './cards/usdc_sol'

import USDT_MATIC from './cards/usdt_matic'

import USDT_AVAX from './cards/usdt_avax'

import USDT_ETH from './cards/usdt_eth'

import USDT_SOL from './cards/usdt_sol'

type Bip39Seed = Buffer

export class MnemonicWallet {

  mnemonic: string;

  seed: Bip39Seed; // bip39 seed

  static init(mnemonic: string): MnemonicWallet {

    let wallet = new MnemonicWallet(mnemonic)

    wallet.init()

    return wallet

  }

  constructor(mnemonic) {

    this.mnemonic = mnemonic

    this.init()

  }

  init() {

    this.seed = bip39.mnemonicToSeedSync(this.mnemonic)

    return this

  }

  get cards(): Card[] {

    const seed = this.seed

    const mnemonic = Buffer.from(this.mnemonic, 'utf8')

    const cards = [

      new BTC({ seed }),
      new BCH({ seed }),
      new BSV({ seed }),
      new DASH({ seed }),
      new DOGE({ seed }),
      new LTC({ seed }),
      new XMR({ seed }),

      new MATIC({ seed: mnemonic }),
      new AVAX({ seed: mnemonic }),
      new ETH({ seed: mnemonic }),
      new SOL({ seed }),

      new USDC_MATIC({ seed: mnemonic }),
      new USDC_AVAX({ seed: mnemonic }),
      new USDC_ETH({ seed: mnemonic }),
      new USDC_SOL({ seed }),

      new USDT_MATIC({ seed: mnemonic }),
      new USDT_AVAX({ seed: mnemonic }),
      new USDT_ETH({ seed: mnemonic }),
      new USDT_SOL({ seed })

    ]

    return cards
  }

}

