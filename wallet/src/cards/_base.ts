
import Transaction from '../transaction'

import PaymentOption from '../payment_option'

import Provider from '../provider'

import PrivateKey from '../private_key'

export default abstract class Card {

  mnemonic: string;

  currency: string;

  chain: string;

  decimals: number;

  token: string;

  chainID: number;

  provider: Provider;

  providerURL: string;

  privateKey: PrivateKey;

  address: string;

  abstract getPrivateKey(): PrivateKey

  abstract getAddress(): Promise<string>

  abstract getBalance(): Promise<number>

  abstract buildSignedPayment(paymentOption: PaymentOption): Promise<Transaction>

}

