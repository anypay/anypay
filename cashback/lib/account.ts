
import * as postgres from './postgres';

async function findById(id) {

  let account = (await postgres('accounts')
               .select('id', 'dash_payout_address')
               .where('id', id)
               .limit(1))[0]

  if (!account) {
    throw new Error(`account ${id} not found`);
  }

  return account;

}

export {
  findById
}
