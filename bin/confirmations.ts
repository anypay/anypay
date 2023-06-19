#!/usr/bin/env ts-node

require('dotenv').config()

import { Command } from 'commander'

import { find } from '../lib/plugins'

import { Confirmation } from '../lib/plugin'

import { Payment } from '../lib/payments'

import { listUnconfirmedPayments, confirmPayment } from '../lib/confirmations'

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

      }

    }

    process.exit(0)

  });


 
program
  .parse(process.argv);



