
require('dotenv').config()

import { Invoice, createInvoice } from '../lib/invoices'

//import { PaymentOption } from '../lib/payment_option'

import { models } from '../lib/models'

import { Account } from '../lib/account'

import {refreshCoins}from '../lib/coins'
import { config } from '../lib/config'

const options = [{
  currency:'USDC',
  chain:'MATIC'
},{
  currency:'USDC',
  chain:'ETH'
}, {
  currency:'USDC',
  chain:'AVAX'
},{
  currency:'USDT',
  chain:'MATIC'
},{
  currency:'USDT',
  chain:'ETH'
}, {
  currency:'USDT',
  chain:'AVAX'
}, {
  currency:'BTC',
  chain:'BTC'
},{
  currency:'BCH',
  chain:'BCH'
},{
  currency:'BSV',
  chain:'BSV'
},{
  currency:'LTC',
  chain:'LTC'
},{
  currency:'DASH',
  chain:'DASH'
},{
  currency:'DOGE',
  chain:'DOGE'
},{
  currency:'XMR',
  chain:'XMR'
}]

/*
const optionsMap = options.reduce((opts, option) =>{

  opts[`${option.currency}_${option.chain}`]

  return opts

}, {})
*/

async function main() {

  await refreshCoins()

  const account: Account = await Account.fromAccessToken({

    token: config.get('ANYPAY_ACCESS_TOKEN')

  })

  let invoice: Invoice = await createInvoice({

    account,

    amount: 100

  })

  const records = await models.PaymentOption.findAll({ where:{ invoice_uid: invoice.uid }})

  for (let option of records){

    const { chain, currency } = option

    const paymentOption = await invoice.getPaymentOption({ chain, currency })

    if (!paymentOption){
      console.log('payment option not found', { chain, currency })
    }

  }

  for (let option of options) {

   try {

    const { chain, currency } = option

    const paymentOption = await invoice.getPaymentOption({ chain, currency })

    if (!paymentOption){
      console.log('payment option not found', {chain, currency})
     }

    if (paymentOption.outputs) {

      console.log(paymentOption.toJSON())

   } else {

      console.log(paymentOption, 'no outputs')

    }
  
  } catch(error){
    console.error(error)
  }

  }
}

main()

