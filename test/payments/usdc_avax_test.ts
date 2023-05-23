
require('dotenv').config()

import { avalanche } from 'usdc'

import * as erc20 from '../../lib/erc20'

import { find } from '../../lib/plugins'

import { createPaymentRequest } from '../../lib/payment_requests'

import { buildSignedPayment, verifyPayment } from '../../lib/plugins'

import { PaymentOption, Transaction } from '../../lib'

import { app } from '../utils'

import { expect } from 'chai'

const mnemonic = process.env.anypay_wallet_mnemonic

describe("Sending USDC Payments on AVAX", () => {

  it("should get the wallet address from the seed phrase", () => {

    let address = avalanche.getAddressFromMnemonic({ mnemonic })

    expect(address).to.be.a('string')

  })

  it("should build and sign a USDC transfer", async () => {

    const plugin = await find({ chain: 'AVAX', currency: 'USDC' })

    let address = '0x4DC29377F2aE10BEC4c956296Aa5Ca7de47692a2'

    let amount = 0.001 * Math.pow(10, plugin.decimals)

    const providerURL = process.env.infura_avalanche_url

    const { txhex, txid } = await erc20.buildERC20Transfer({
      address,
      amount,
      mnemonic,
      providerURL,
      token: plugin.token
    })

    expect(txhex).to.be.a('string')

    expect(txid).to.be.a('string')

    let result = await erc20.broadcastSignedTransaction({ txhex, providerURL })

    expect(result.transactionHash).to.be.equal(txid)

  })

  it('should create a payment request for USDC on AVAX', async () => {

    const template = [{
      chain: 'AVAX',
      currency: 'USDC',
      to: [{
        address: '0x4DC29377F2aE10BEC4c956296Aa5Ca7de47692a2',
        amount: 0.05,
        currency: 'USD'
      }]
    }]

    const paymentRequest = await createPaymentRequest(app.id, template)

    expect(paymentRequest.template.length).to.be.equal(1)

    expect(paymentRequest.template[0].chain).to.be.equal('AVAX')

    expect(paymentRequest.template[0].currency).to.be.equal('USDC')

    const paymentOption: PaymentOption = await paymentRequest.getPaymentOption({
      chain: 'AVAX',
      currency: 'USDC'
    })

    expect(paymentOption.outputs.length).to.be.equal(1)

    const transaction: Transaction = await buildSignedPayment({ paymentOption, mnemonic })

    console.log(transaction, 'transaction')

    expect(transaction.txhex).to.be.a('string')

    expect(transaction.txid).to.be.a('string')

    const isValid = await verifyPayment({ paymentOption, transaction })

    expect(isValid).to.be.equal(true)

  })



})

