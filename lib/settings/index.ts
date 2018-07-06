
import * as AccountModel from '../models/account'; 

async function setDenomination(accountId: number, denomination: string): Promise<string> {

  let result = await AccountModel.update({
    denomination: denomination  
  }, {
    where: {
      id: accountId
    }
  });

  return denomination;

}

async function getDenomination(accountId: number): Promise<string> {

  let account = await AccountModel.findOne({
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

