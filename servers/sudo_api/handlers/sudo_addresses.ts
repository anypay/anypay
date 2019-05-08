
import { database, addresses, models } from '../../../lib';

import * as Boom from 'boom';

export async function index(request, h) {

  var query: string;

  if (request.query.locked === 'true') {

    query = `select addresses.*, accounts.email from addresses  join accounts on accounts.id = addresses.account_id where locked = true;`;

  }

  if (request.query.locked === 'false') {

    query = `select addresses.*, accounts.email from addresses  join accounts on accounts.id = addresses.account_id where locked = false;`;

  }

  if (typeof request.query.locked === 'undefined') {

    query = `select addresses.*, accounts.email from addresses  join accounts on accounts.id = addresses.account_id;`;

  }

  try {

    let addresses = await database.query(query);

    return addresses[0];

  } catch(error) {

    console.log(error.message);

    return { error: error.message, message: error.message };
  }

}

export async function lockAddress(request, h) {

  /*

    POST /sudo/accounts/:account_id/addresses/:currency/locks

  */

  let account = await models.Account.findOne({ where: {

    id: request.params.account_id

  }});

  await addresses.lockAddress(account.id, request.params.currency);

  return { success: true };

}

export async function unlockAddress(request, h) {

  /*

    DELETE /sudo/accounts/:account_id/addresses/:currency/locks

  */

  let account = await models.Account.findOne({ where: {

    id: request.params.account_id

  }});

  await addresses.unlockAddress(account.id, request.params.currency);

  return { success: true };

}
