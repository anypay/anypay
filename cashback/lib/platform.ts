
/* Using Anypay Platform To Collect Payment To A Cashback Address */

/*

  1) Lookup Cashback Address In Database

  2) Create Payment Request To Cash Back Address

  3) Upon Payment Associate The Output With Cashback

*/

import { app } from 'anypay'

import { models } from '../../lib'

import * as cashbackDash from '../../plugins/dash/lib/cashback';
import * as cashbackBch from '../../plugins/bch/lib/cashback';


export function getCashBackAddresses() {

  return {

    'DASH': {
      address: 'XnEw2KjfLVAy1hSXMFWLCcod5X7rLM581p',
      balance: null
    },

    'BCH': {
      address: cashbackBch.getCashBackAddress(),
      balance: null
    }

  }

}

(async () => {

  const anypay = app(process.env.ANYPAY_API_SECRET)

  // lookup cashback address

  let cashbackAddresses = getCashBackAddresses()

  // lookup account addresses

  let dashAddress = await models.Address.findOne({ where: {

    account_id: 1177,

    currency: 'DASH'

  }})

  let bchAddress = await models.Address.findOne({ where: {

    account_id: 1177,

    currency: 'BCH'

  }})

  // create payment request

  let amount = 1
  let cashbackAmount = 0.10

  let params = [{
    currency: 'DASH',
    to: [{
      address: dashAddress.value,
      amount: amount,
      currency: 'USD' 
    }, {
      address: cashbackAddresses['DASH'].address,
      amount: amount - cashbackAmount,
      currency: 'USD'
    }]
  }, {
    currency: 'BCH',
    to: [{
      address: bchAddress.value,
      amount: amount,
      currency: 'USD' 
    }, {

      address: cashbackAddresses['BCH'].address,
      amount: amount - cashbackAmount,
      currency: 'USD'
    }]
  }]

  console.log(params)

  anypay.request(params, {
    redirect: 'https://anypayinc.com' 
    webhook: 'https://anypayinc.com' 
  })
  .then(request => {

    request.on('paid', (currency, txid, txhex) => {

    })

    request.on('cancelled', (reason) => {

    })

    request.on('expired', () => {

    })

    request.on('rejected', (error) => {

    })
  
  }).catch(error => {
    console.error(error.request) 
  })
})()

