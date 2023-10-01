
import { Orm } from './orm'

import { Account } from './account'

import { log } from './log'

interface AccountLinks {
  source: LinkedAccount[];
  target: LinkedAccount[];
}

export async function listLinkedAccounts(account: Account, options: any={}): Promise<AccountLinks> {

  let source = await models.LinkedAccount.findAll({
    where: {
      source: account.id
    },
    include: [{
      model: models.Account,
      as: 'source_account',
      attributes: ['id', 'email']
    }, {
      model: models.Account,
      as: 'target_account',
      attributes: ['id', 'email']
    }],
    attributes: ['id']
  })

  let target = await models.LinkedAccount.findAll({
    where: {
      target: account.id
    },
    include: [{
      model: models.Account,
      as: 'source_account',
      attributes: ['id', 'email']
    }, {
      model: models.Account,
      as: 'target_account',
      attributes: ['id', 'email']
    }],
    attributes: ['id']
  })

  return {
    target,
    source
  }

}

export async function linkAccount(account: Account, { email }: { email: string }): Promise<LinkedAccount> {

  let target = await models.Account.findOne({ where: { email }})

  if (!target) { throw new Error(`account not found with email ${email}`) }

  let [record] = await models.LinkedAccount.findOrCreate({

    where: {

      target: target.id,

      source: account.id

    }

  })

  return new LinkedAccount(record)

}

export async function unlinkAccount(account: Account, {id}: {id: string}): Promise<void> {

  let link = await models.LinkedAccount.findOne({ where: { id }})

  log.info('accounts.unlink', { account_id: account.id, account_link_id: id })

  if (link.target === account.id || link.source === account.id) {

    await link.destroy()

  }

}

export async function getLink({ source, target }: { source: number, target: number }): Promise<LinkedAccount | void> {

  let record = await models.LinkedAccount.findOne({ where: { source, target }})

  if (record) {

    return new LinkedAccount(record)

  }

}

class LinkedAccount extends Orm {

}

export {

  LinkedAccount

}
