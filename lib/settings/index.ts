
import * as models from '../models'; 

async function setDenomination(accountId: number, denomination: string): Promise<string> {

  let result = await models.Account.update({
    denomination: denomination  
  }, {
    where: {
      id: accountId
    }
  });

  return denomination;

}

async function getDenomination(accountId: number): Promise<string> {

  let account = await models.Account.findOne({
    where: {
      id: accountId
    }
  });

  return account.denomination;

}

export {
  getDenomination,
  setDenomination
}

