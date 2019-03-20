
import { models, log } from '../../../lib';

import { boomify } from 'boom'

export async function index(request, h) {

  return models.BankAccount.findAll();

}

export async function show(request, h) {

  return models.BankAccount.findOne({ where: { id: request.params.id }});

}

export async function del(request, h) {

  let bankAccount = await models.BankAccount.findOne({ where: { id: request.params.id }});

  return bankAccount.destroy();

}

export async function create(request, h) {

  console.log('PAYLOAD', request.payload);

  try {

    let account = await models.Account.findOne({ where: {

      id: parseInt(request.payload.account_id)

    }});

    if (!account) {

      let error = new Error(`account not found with id ${request.payload.account_id}`);

      log.error(error.message);
      
      return boomify(error, { message: error.message });

    }

    let bankAccount = models.BankAccount.findOne({ where: { account_id: account.id }});

    if (bankAccount) {

      let error = new Error(`bank account already set for account ${account.id}`);

      log.error(error.message);

      return boomify(error, { message: error.message });

    }

    return models.BankAccount.create(request.payload);

  } catch(error) {

    log.error('error caught', error.message);

    return boomify(error, { message: error.message });

  }


}


