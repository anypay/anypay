
import { models } from '../models'; 

import { log } from '../log'

export async function getAccountSetting(account_id, key: string, options: { default?: string} = {}) {

  let record = await models.AccountSetting.findOne({ where: { account_id, key }})

  if (record) { return record.value }

  return options.default

}
export async function setAccountSetting(account_id, key: string, value: string) {

  log.info('account.settings.update', {account_id, key, value })

  let [record, isNew] = await models.AccountSetting.findOrCreate({
    where: { account_id, key },
    defaults: { account_id, key, value }
  })

  if (!isNew) { 
    record.value = value
    await record.save()
  }

  
  return record.toJSON()

}

async function setDenomination(accountId: number, denomination: string): Promise<string> {

  await models.Account.update({
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

