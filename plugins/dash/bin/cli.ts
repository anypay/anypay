#!/usr/bin/env ts-node

const program = require('commander');

import {checkAddressForPayments} from '../lib/check_for_payments';
import {handlePayment} from '../../../lib/payment_processor';

program
  .command('checkaddressforpayment <address>')
  .action(async (address) => {

    let balance = await checkAddressForPayments(address);

    console.log('blockcypher:response', balance);

    if (balance.total_received > 0) {

      let amountPaid = balance.total_received / 100000000.00000;

      let payment = {
        currency: 'DASH',
        address: balance.address,
        amount: amountPaid,
        hash: balance.txrefs[0].tx_hash
      };
      
      console.log(payment);

    } else {

      console.log(`no payments for address ${address}`);

    }

    process.exit(0);

  });

