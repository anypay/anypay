require('dotenv').config()

import { createPaymentRequest } from '../../lib/payment_requests'
import { submitPayment } from '../../lib/pay/json_v2/protocol'

import { expect } from '../utils'

const exampleTransaction = {

  txid: '0xd2fe6e48eb27516dd58ccbba672c6276daf84d1efc0afbfb7d28ce5cd277bc99',

  amount: 0.03345448,

  address: '0x99298b3724c97b3fc8dabc3363f6a25447dcc9f7',

  date: 'May-10-2023 09:46:11 PM +UTC'

}

describe('Payments with Ethereum', () => {

  /*
     To test payments of ETH we shall need several test vectors to run through various scenarios 
  */

  it('should reject payments that were broadcast before the invoice was created', () => {

    // Generate a payment request with the correct amount but different address
    // Call submitPayment with the example transaction id 
    // Assert that the error contains reference to payment coming before invoice

    const paymentRequest = await createPaymentRequest(0, {
      currency: 'ETH',
      amount: exampleTransaction.amount
      to: [{
        address: exampleTransaction.adddress,
        currency: 'ETH' 

      }]
    })

    try {

      let result = await submitPayment({
        currency: 'ETH',
        chain: 'ETH',
        transactions: [{
          tx: exampleTransaction.txid
        }]
      })

      assert(false, 'the payment should have been rejected with PaymentPredatesInvoiceError')

    } catch(error) {

      assert.strictEquals(error.name, "PaymentPredatesInvoiceError")
      assert.strictEquals(error.message, "Payment date comes before invoice date")

    }

  })

  it('should reject payments with the incorrect address', async () => {

    // Generate a payment request with the correct amount but different address
    // Call submitPayment with the example transaction id 
    // Assert that the error contains reference to incorrect address


    const paymentRequest = await createPaymentRequest(0, {
      currency: 'ETH',
      amount: exampleTransaction.amount,
      to: [{
        address: '0xebec795c9c8bbd61ffc14a6662944748f299cacf',
        currency: 'ETH' 
      }]
    })

    try {

      let result = await submitPayment({
        currency: 'ETH',
        chain: 'ETH',
        transactions: [{
          tx: exampleTransaction.txid
        }]
      })

      assert(false, 'the payment should have been rejected with IncorrectPaymentAddress')

    } catch(error) {

      assert.strictEquals(error.name, "IncorrectPaymentAddress")
      assert.strictEquals(error.message, "Payment address is not correct")

    }
  })

  it('should reject payments with the incorrect amount', async () => {

    // Generate a payment request with the correct address but different amount
    // Call submitPayment with the example transaction id 
    // Assert that the error contains reference to incorrect amount

    const paymentRequest = await createPaymentRequest(0, {
      currency: 'ETH',
      amount: 1,
      to: [{
        address: exampleTransaction.address,
        currency: 'ETH' 
      }]
    })

    try {

      let result = await submitPayment({
        currency: 'ETH',
        chain: 'ETH',
        transactions: [{
          tx: exampleTransaction.txid
        }]
      })

      assert(false, 'the payment should have been rejected with IncorrectPaymentAmount')

    } catch(error) {

      assert.strictEquals(error.name, "IncorrectPaymentAmount")
      assert.strictEquals(error.message, "Payment amount is not correct")

    }
  })

  it('should accept a valid payment and mark the invoice as paid', () => {

    // Generate a payment request with the correct address and amount
    // Manually update the invoice data to be before the transaction 
    // Call submitPayment with the example transaction id:
    const paymentRequest = await createPaymentRequest(0, {
      currency: 'ETH',
      amount: exampleTransaction.amount,
      to: [{
        address: exampleTransaction.address,
        currency: 'ETH' 
      }]
    })

    let result = await submitPayment({
      currency: 'ETH',
      chain: 'ETH',
      transactions: [{
        tx: exampleTransaction.txid
      }]
    })

    expect(result.success).to.be.equal(true)

  })

  it('should reject a transaction if that has already been used to pay another invoice', async () => {

    // Generate a payment request with the correct address and amount
    // Manually update the invoice data to be before the transaction 
    // Call submitPayment with the example transaction id:
    // Generate another payment request with the correct address and amount
    // Manually update the invoice data to be before the transaction 
    // Call submitPayment with the example transaction id:
    // Assert that the new transaction is rejected with error referencing duplicate payment

    const paymentRequest1 = await createPaymentRequest(0, {
      currency: 'ETH',
      amount: exampleTransaction.amount,
      to: [{
        address: exampleTransaction.address,
        currency: 'ETH' 
      }]
    })

    let result1 = await submitPayment({
      currency: 'ETH',
      chain: 'ETH',
      transactions: [{
        tx: exampleTransaction.txid
      }]
    })

    expect(result1.success).to.be.equal(true)

    const paymentRequest2 = await createPaymentRequest(0, {
      currency: 'ETH',
      amount: exampleTransaction.amount,
      to: [{
        address: exampleTransaction.address,
        currency: 'ETH' 
      }]
    })

    let result2 = await submitPayment({
      currency: 'ETH',
      chain: 'ETH',
      transactions: [{
        tx: exampleTransaction.txid
      }]
    })

    expect(result2.success).to.be.equal(false)

  })

  /*
    We also must test confirmations of blocks and webhooks for when ETH payments confirm
  */

  it('should detect confirmations of completed ETH payments', async () => {

    // Monitor the ethereum network for new block confirmation events
    // whenever a new block is published, check the txids contained therein
    // if any of the txid match a trasnaction in "confirming" state, mark it as confirmed

    // alternatively monitor the individual transaction for block confirmations by
    // either periodically polling the status update of all confirmation ethereum
    // payments or by subscribing after receipt of payment to an event source or websocket
    // for real time updates on confirmations for that given transaction

  })

  it('should update the invoice status to "paid" upon confirmation', async () => {

  })

  it('newly paid invoices should be in the "confirming" state', async () => {

  })

  it('should send a webhook when the invoice enters confirming state', async () => {

  })

  it('should send a webhook when the invoice enters paid state', async () => {

  })

  /*
    We may also receive transactions that never confirm and eventually expire
  */

  it('should detect when a transaction has expired and mark the invoice as "unpaid"', async () => {

    // Each transaction on Ethereum contains a nonce that may only be used once.
    // To determine whether a transaction has become definitely invalidated, monitor for
    // transactions sent from that address and see if the nonce is used in another transaction
    // if that nonce is indeed used and confirmed in another transaction, the original payment
    // becomes entire invalid

  })

})
