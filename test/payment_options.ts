
require('dotenv').config()

import { Invoice, createInvoice } from '../lib/invoices'

//import { PaymentOption } from '../lib/payment_option'

import { models } from '../lib/models'

import { Account } from '../lib/account'

import {refreshCoins}from '../lib/coins'

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
  currency:'USDC',
  chain:'SOL'
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
  currency:'USDT',
  chain:'SOL'
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

    token: process.env.anypay_access_token

  })

  let invoice: Invoice = await createInvoice({

    account,

    amount: 100

  })

  const records = await models.PaymentOption.findAll({ where:{ invoice_uid: invoice.uid }})

  console.log(records, 'records')

  for (let option of records){

    const { chain, currency } = option

    const paymentOption = await invoice.getPaymentOption({ chain, currency })

    if (!paymentOption){
      console.log('payment option not found', { chain, currency })
    }

    console.log({currency: paymentOption.currency, chain:paymentOption.chain, outputs:paymentOption.outputs}, '--PO')

  }

  for (let option of options) {

    const { chain, currency } = option

    const paymentOption = await invoice.getPaymentOption({ chain, currency })

    if (!paymentOption){
      console.log('payment option not found', {chain, currency})
     }

    for (let output of paymentOption.outputs) {

      console.log({currency, chain, output}, 'output')

      if (!(output.amount  >0)) {

        console.log('NO AMOUNT', {currency, chain, output})

       }

    }
  
   }

}

main()

