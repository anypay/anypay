#!/usr/bin/env ts-node

import { models } from '../lib';

import * as program from 'commander';

program
  .command('create <serial_number> <machine_type>')
  .action(async (serial_number, machine_type) => {

    var machine = await models.VendingMachine.findOne({ where: {

      serial_number

    }});

    if (machine) {

      console.log(`machine with serial number ${serial_number} already exists`);

    } else {

      machine = await models.VendingMachine.create({
        serial_number, machine_type
      });

      console.log(`vending machine created`, JSON.stringify(machine.toJSON()));

    }

    process.exit(0);


  });

program
  .command('payout <vending_machine_id> <amount> <address> <txid>')
  .action(async (id, amount, address, txid) => {

    var machine = await models.VendingMachine.findOne({ where: {

      id

    }});

    if (machine) {

      let payout = await models.VendingPayout.create({
        vending_machine_id: id,
        amount,
        address,
        txid
      })

      console.log('payout.created', payout.toJSON());

    } else {

      console.log('vending machine not found');

    }

    process.exit(0);


  });

program.parse(process.argv);
