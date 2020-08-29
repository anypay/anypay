require('dotenv').config()

import { paymentRequestToPaymentOptions } from '../../lib/payment_options'

describe("Payment Requests", () => {

  it("#createPaymentOptions should create payment options for a payment request", async () => {


    /*
      1) Create Valid Payment Request

      2) Convert Each Payment Request Output For Each Currency To Satoshis

    */

    let paymentRequest = [{
      "currency": "BCH",
      "to": [{
        "address": "bitcoincash:qr2wnq2pzyrffwv25d6x9gf5re8p084u05s3nfu8am",
        "amount": 10,
        "currency": "USD"
      },
      {
        "address": "bitcoincash:qr2wnq2pzyrffwv25d6x9gf5re8p084u05s3nfu8am",
        "amount": 150,
        "currency": "EUR"
      }]
    }, {
      "currency": "BSV",
      "to": [{
        "address": "153QX8cGtiXJdPjRMevWpYdmSPqitb6fQv",
        "amount": 10,
        "currency": "USD"
      },
      {
        "address": "153QX8cGtiXJdPjRMevWpYdmSPqitb6fQv",
        "amount": 150,
        "currency": "EUR"
      }]
    }]

    let transformed = await paymentRequestToPaymentOptions({
      invoice_uid: 123345,
      template: paymentRequest
    })

    console.log('transformed', transformed)

    transformed.forEach(option => {
      console.log(JSON.stringify(option.toJSON()))
    });

  })

})


