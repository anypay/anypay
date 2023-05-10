require('dotenv').config()

import { createPaymentRequest } from '../../lib/payment_requests'

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

    const paymentRequest = await createPaymentRequest(0, {
      currency: 'ETH',
      amount: exampleTransaction.amount
      to: [{
        address: exampleTransaction.adddress,
        currency: 'ETH' 

      }]
    })

    // Generate a payment request with the correct amount but different address
    // Call submitPayment with the example transaction id 
    // Assert that the error contains reference to payment coming before invoice
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

    const paymentRequest2 = await createPaymentRequest(0, {
      currency: 'ETH',
      amount: exampleTransaction.amount,
      to: [{
        address: exampleTransaction.address,
        currency: 'ETH' 
      }]
    })


  })

  /*
    We also must test confirmations of blocks and webhooks for when ETH payments confirm
  */

  it('should detect confirmations of completed ETH payments')
  it('should update the invoice status to "paid" upon confirmation')
  it('newly paid invoices should be in the "confirming" state')
  it('should send a webhook when the invoice enters confirming state')
  it('should send a webhook when the invoice enters paid state')

  /*
    We may also receive transactions that never confirm and eventually expire
  */

  it('should detect when a transaction has expired and mark the invoice as "unpaid"')

})
