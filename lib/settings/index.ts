
import { models } from '../models'; 

export async function getAccountSetting(account_id, key: string, options: { default?: string} = {}) {

  let record = await models.AccountSetting.findOne({ where: { account_id, key }})

  if (record) { return record.value }

  return options.default

}

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

