
import { models, log } from '../../../lib';
import { Boom } from 'hapi';

export async function create(req, h) { 

  let cash_deposit = await models.CashDeposit.create(req.payload);

  return { cash_deposit }

}

export async function index(req, h) { 

  let cash_deposits = await models.CashDeposit.findAll({
    order: [[
      "createdAt", "DESC"
    ]]
  });

  return { cash_deposits }

}
