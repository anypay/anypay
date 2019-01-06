
import { models, log } from '../../../lib';

export async function index(request, h) {

  return models.BankAccount.findAll();

}

export async function create(request, h) {

  let account = await models.Account.findOne({ where: {

    id: parseInt(request.payload.account_id)

  }});

  if (!account) {

    throw new Error(`account not found with id ${request.payload.account_id}`);

  }

  let bankAccount = models.BankAccount.findOne({ where: { account_id: account.id }});

  if (bankAccount) {

    throw new Error(`bank account already set for account ${account.id}`);

  }

  return models.BankAccount.create(request.payload);

}


