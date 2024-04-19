
import Transaction from '../transaction'

import PaymentOption from '../payment_option'

import Provider from '../provider'

import PrivateKey from '../private_key'

import * as bip39 from 'bip39'

export default abstract class Card {

  phrase: string;

  seed: Buffer;

  abstract currency: string;

  abstract chain: string;

  abstract decimals: number;

  token?: string;

  chainID?: number;

  abstract providerURL: string;

  abstract privateKey: PrivateKey;

  address?: string;

  abstract getPrivateKey(): PrivateKey

  abstract getAddress(): Promise<string>

  abstract getBalance(): Promise<number>

  abstract buildSignedPayment(paymentOption: PaymentOption): Promise<Transaction>

  abstract get provider(): Provider

  constructor({ phrase }: { phrase: string }) {

    this.phrase = phrase

    this.seed = bip39.mnemonicToSeedSync(phrase)

  }

}
