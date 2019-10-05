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

program.parse(process.argv);
