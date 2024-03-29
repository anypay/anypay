
require('dotenv').config()

import { Invoice, createInvoice } from '../lib/invoices'

//import { PaymentOption } from '../lib/payment_option'
import { accounts as Account } from '@prisma/client'

import {refreshCoins}from '../lib/coins'
import { config } from '../lib/config'
import prisma from '../lib/prisma'
import { generateAccount } from './utils'

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



  const account: Account = await generateAccount()

  let invoice: Invoice = await createInvoice({

    account,

    amount: 100

  })

  const records = await prisma.payment_options.findMany({
    where: {
      invoice_uid: String(invoice.uid)
    }
  
  })

  for (let option of records){

    const { chain, currency } = option

    const paymentOption = await prisma.payment_options.findFirstOrThrow({
      where: {
        chain,
        currency,
        invoice_uid: String(invoice.uid)
      }
    })

    if (!paymentOption){
      console.log('payment option not found', { chain, currency })
    }

  }

  for (let option of options) {

   try {

    const { chain, currency } = option

    const paymentOption = await prisma.payment_options.findFirstOrThrow({
      where: {
        chain,
        currency,
        invoice_uid: String(invoice.uid)
      }
    })

  
  } catch(error){
    console.error(error)
  }

  }
}

main()

