#!/usr/bin/env ts-node

require('dotenv').config()

import { Command } from 'commander'

import { find } from '../lib/plugins'

import { Confirmation } from '../lib/plugin'

import { Payment } from '../lib/payments'

import { listUnconfirmedPayments, confirmPayment, getConfirmationForTxid, confirmPaymentByTxid } from '../lib/confirmations'

import { initialize } from '../lib'

const program = new Command();

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

    console.log({ payment: payment.toJSON() })

  })
  
program
  .command('confirm-payments <currency> <chain>')
  .action(async (currency, chain) => {

    await initialize()

    const plugin = find({ chain, currency })

    const unconfirmed: Payment[] = await listUnconfirmedPayments({ chain, currency })

    console.log(`${unconfirmed.length} unconfirmed payments of ${currency} on ${chain}`)

    for (let payment of unconfirmed) {

      try {

        console.log(payment.toJSON())

        const confirmation: Confirmation = await plugin.getConfirmation(payment.txid)

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



