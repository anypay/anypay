/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

require('dotenv').config()

import { polygon } from 'usdc'

import { expect } from 'chai'

import { createPaymentRequest } from '../../lib/payment_requests'

import { buildSignedPayment, verifyPayment } from '../../lib/plugins'

import { PaymentOption, Transaction, config } from '../../lib'

import { app } from '../utils'

const mnemonic = config.get('anypay_wallet_mnemonic')

describe("Sending USDC Payments on MATIC", () => {

  it.skip("should get the wallet address from the seed phrase", () => {

    let address = polygon.getAddressFromMnemonic({ mnemonic })

    expect(address).to.be.a('string')

  })

  it.skip("should build and sign a USDC transfer", async () => {

    let address = '0x4DC29377F2aE10BEC4c956296Aa5Ca7de47692a2'

    let amount = 0.01 * Math.pow(10, 6)

    const {txhex, txid} = await polygon.buildUSDCTransfer({
      to: address,
      amount,
      mnemonic
    })

    console.log({txhex, txid})

    expect(txhex).to.be.a('string')

    expect(txid).to.be.a('string')

    //let result = await polygon.broadcastSignedTransaction({ txhex })

    //expect(result.transactionHash).to.be.equal(txid)

  })

  it('should create a payment request for USDC on MATIC', async () => {

    const template = [{
      chain: 'MATIC',
      currency: 'USDC',
      to: [{
        address: '0x4DC29377F2aE10BEC4c956296Aa5Ca7de47692a2',
        amount: 0.05,
        currency: 'USD'
      }]
    }]

    const paymentRequest = await createPaymentRequest(app.id, template)

    expect(paymentRequest.template.length).to.be.equal(1)

    expect(paymentRequest.template[0].chain).to.be.equal('MATIC')

    expect(paymentRequest.template[0].currency).to.be.equal('USDC')

    const paymentOption: PaymentOption = await paymentRequest.getPaymentOption({
      chain: 'MATIC',
      currency: 'USDC'
    })

    console.log(paymentOption.toJSON())

    expect(paymentOption.outputs.length).to.be.equal(1)

    const transaction: Transaction = await buildSignedPayment({ paymentOption, mnemonic })

    console.log(transaction, 'transaction')

    expect(transaction.txhex).to.be.a('string')

    expect(transaction.txid).to.be.a('string')

    const isValid = await verifyPayment({ paymentOption, transaction })

    expect(isValid).to.be.equal(true)

    // TODO: Submit to Anypay for Verification but Not Broadcasting

  })

  it.skip('createInvoice should include an option for USDC on MATIC', async () => {


  })

})
