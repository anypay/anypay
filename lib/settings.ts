
import { models } from './models'; 

import { log } from './log'

async function setDenomination(account_id: number, denomination: string): Promise<string> {

  let result = await models.Account.update({
    denomination: denomination  
  }, {
    where: {
      id: account_id
    }
  });

  log.info('account.denomination.set', {
    account_id,
    denomination
  })

  return denomination;

}

async function getDenomination(account_id: number): Promise<string> {

  let account = await models.Account.findOne({
    where: {
      id: account_id
    }
  });

  return account.denomination;

}

export {
  getDenomination,
  setDenomination
}

