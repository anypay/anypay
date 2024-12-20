#!/usr/bin/env ts-node
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

import { Command } from 'commander'

import { find } from '@/lib/plugins'

import { Confirmation } from '@/lib/plugin'

import { listUnconfirmedPayments, confirmPayment, getConfirmationForTxid, confirmPaymentByTxid, startConfirmingTransactions, revertPayment } from '@/lib/confirmations'

import { initialize } from '@/lib'

const program = new Command();

program
  .command('start-confirming-transactions')
  .action(async () => {

    await initialize()

    startConfirmingTransactions()

  });

program
  .command('revert-payment <txid>')
  .action(async (txid) => {

    await initialize()

    const result = await revertPayment({ txid })

    console.log(result)

  });

program
  .command('count-unconfirmed <currency> <chain>')
  .action(async (currency, chain) => {

    await initialize()

    const unconfirmed = await listUnconfirmedPayments({ chain, currency })

    console.log(`${unconfirmed.length} unconfirmed payments of ${currency} on ${chain}`)

  });

program
  .command('manual-confirmation <txid> <blockhash> <blockheight> <timestamp>')
  .action(async (txid, confirmation_hash, confirmation_height, confirmation_date) => {

    await initialize()

    const confirmation = {
      confirmation_hash,
      confirmation_height,
      confirmation_date
    }

    const result = await confirmPaymentByTxid({ txid, confirmation })

    console.log(result)

  });



program
  .command('confirm-payment <txid>')
  .action(async (txid) => {

    let payment = await getConfirmationForTxid({ txid })

    console.log({ payment: payment })

  })
  
program
  .command('confirm-payments <currency> <chain>')
  .action(async (currency, chain) => {

    await initialize()

    const plugin = find({ chain, currency })

    const unconfirmed = await listUnconfirmedPayments({ chain, currency })

    console.log(`${unconfirmed.length} unconfirmed payments of ${currency} on ${chain}`)

    for (let payment of unconfirmed) {

      try {

        console.log(payment)

        const confirmation: Confirmation = await plugin.getConfirmation(payment.txid) as Confirmation

        console.log({ confirmation })

        if (confirmation) {

          const result = await confirmPayment({ payment, confirmation })

          console.log(result, 'confirmPayment.result')

        }

      } catch(error) {

        console.error(error, 'CONFIRM ERROR')

        if (error.response) {

          console.log(error.response.data)

        }

      }

    }

    process.exit(0)

  });


 
program
  .parse(process.argv);



