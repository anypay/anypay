
require('dotenv').config()

import { Invoice, createInvoice } from '../lib/invoices'

import { PaymentOption } from '../lib/payment_option'

import { Account } from '../lib/account'

async function main() {

  const account: Account = await Account.fromAccessToken({

    token: process.env.anypay_access_token

  })

  let invoice: Invoice = await createInvoice({

    account,

    amount: 0.01

  })

  console.log(invoice)

  const paymentOptions: PaymentOption[] = await invoice.getPaymentOptions()

  for (let paymentOption of paymentOptions) {

    const { chain, currency } = paymentOption

    console.log({ chain, currency })

  }

}

main()

