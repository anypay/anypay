#!/usr/bin/env ts-node

require('dotenv').config()

const accountId = 1177;

import { createInvoice } from './lib/invoices'

import { Account } from './lib/account'

import { findOne } from './lib/orm'

async function  main() {

  const account = await findOne<Account>(Account, {

    where: {

      id: accountId

    }

  })

  const invoice = await createInvoice({
    account,
    amount: 100
  })

  console.log(invoice, '--invoice--')

}

main()

