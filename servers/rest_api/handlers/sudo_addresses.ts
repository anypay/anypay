
import { addresses, models } from '../../../lib';

import * as Boom from 'boom';

export async function lock(request, h) {

  /*

    POST /sudo/accounts/:account_id/addresses/:currency/locks

  */

  let account = await models.Account.findOne({ where: {

    id: request.params.account_id

  }});

  await addresses.lockAddress(account.id, request.params.currency);

  return { success: true };

}

export async function unlock(request, h) {

  /*

    DELETE /sudo/accounts/:account_id/addresses/:currency/locks

  */

  let account = await models.Account.findOne({ where: {

    id: request.params.account_id

  }});

  await addresses.unlockAddress(account.id, request.params.currency);

  return { success: true };

}
