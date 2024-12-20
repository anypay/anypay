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

import { Invoice, createInvoice } from '@/lib/invoices'

//import { PaymentOption } from '../lib/payment_option'
import { accounts as Account } from '@prisma/client'

import {refreshCoins}from '@/lib/coins'
import prisma from '@/lib/prisma'
import { generateAccount } from '@/test/utils'

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

async function main() {

  await refreshCoins()

  const account: Account = await generateAccount()

  let invoice: Invoice = await createInvoice({

    account,

    amount: 100

  })

  const records = await prisma.payment_options.findMany({
    where: {
      invoice_uid: invoice.uid
    }
  
  })

  for (let option of records){

    const { chain, currency } = option

    const paymentOption = await prisma.payment_options.findFirstOrThrow({
      where: {
        chain,
        currency,
        invoice_uid: invoice.uid
      }
    })

    if (!paymentOption){
      console.log('payment option not found', { chain, currency })
    }

  }

  for (let option of options) {

   try {

    const { chain, currency } = option

    await prisma.payment_options.findFirstOrThrow({
      where: {
        chain,
        currency,
        invoice_uid: invoice.uid
      }
    })

  
  } catch(error){
    console.error(error)
  }

  }
}

main()

