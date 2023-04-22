#!/usr/bin/env ts-node

require('dotenv').config()

const accountId = 1177;

import { createInvoice } from './lib/invoices'

import { Account } from './lib/account'

import { findOne } from './lib/orm'

import { listPaymentOptions } from './lib/pay/json_v2/protocol'

import { refreshCoins } from './lib/coins'

import { app } from 'anypay'

async function  main() {

  await refreshCoins()

  const anypay = app({

    apiBase: 'https://api.next.anypayx.com'

  })

  const account = await findOne<Account>(Account, {

    where: {

      id: accountId

    }

  })

  const invoice = await createInvoice({
    account,
    amount: 100
  })

  console.log(invoice.toJSON(), '--invoice--')

  const { paymentOptions } = await listPaymentOptions(invoice)

  for (let option of paymentOptions) {

    console.log(option)

    const paymentOption = await anypay.getPaymentOption({
      uid: invoice.uid,
      chain: option.chain,
      currency: option.currency
    })

    console.log({ paymentOption })

    console.log(JSON.stringify({ paymentOption }))

  }
}

main()

