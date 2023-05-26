import ERC20_Card from './_erc20'

import PaymentOption from '../payment_option'

import Transaction from '../transaction'

import { polygon } from 'usdc'

export default class USDC_MATIC extends ERC20_Card {

  currency = 'USDC'

  chain = 'MATIC'

  token = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'

  decimals = 6

  chainID = 137

  providerURL = process.env.infura_polygon_url //TODO: Get from Config or Browser

  async buildSignedPayment(option: PaymentOption): Promise<Transaction> {

    // TODO: Parse to and amount from data rather than outputs
    const { amount, address: to } = option.instructions[0].outputs[0]

    const {txhex, txid} = await polygon.buildUSDCTransfer({
      mnemonic: this.phrase,
      amount,
      to,
      transmit: false
    })

    return { txhex, txid }

  }

}

