
import * as Boom from 'boom';

import { models } from '../../../lib';

export async function index(req, h) {

  try {

    let vending_machines = await  models.VendingMachine.findAll();

    return { vending_machines }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show(req, h) {

  try {

    let vending_machine = await  models.VendingMachine.findOne({ where: { id: req.params.id }});

    let vending_payouts = await  models.VendingPayout.findAll({ where: { vending_machine_id: req.params.id }});

    return { vending_machine, vending_payouts }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}


