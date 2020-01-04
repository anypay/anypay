#!/usr/bin/env ts-node

require('dotenv').config();

import { models } from '../lib';
import { Op } from 'sequelize';

(async () => {

  // get all the vending_machines
  let vending_machines = await models.VendingMachine.findAll(); 

  // map terminal_id to vending_machine_id
  let mapTerminalIdToVendingMachineId = vending_machines.reduce((m, machine) => {
    m[machine.serial_number] = machine.id;

    return m;
  }, {});

  console.log('map', mapTerminalIdToVendingMachineId);

  // get all vending_transactions without vending_machine_ind
  let transactions = await models.VendingTransaction.findAll({ where: {
    vending_machine_id: {
      [Op.is]: null
    }
  }});

  // update each with vending_machine_id
  for (let i = 0; i < transactions.length; i++) {

    let tx = transactions[i];

    if (!mapTerminalIdToVendingMachineId[tx.terminal_id]) {

      continue;

    }

    tx.vending_machine_id = mapTerminalIdToVendingMachineId[tx.terminal_id];

    await tx.save();

    console.log(tx.toJSON());

  }

  process.exit(0);

})();

