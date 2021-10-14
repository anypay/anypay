import { models, log } from './';

export async function listAll() {

  log.info('ambassadors.listall');

  let resp = await models.Ambassador.findAll();

  return resp;

}

export async function getAmbassadorAccount(ambassadorId) {

  let ambassador = await models.Ambassador.findOne({ where: { id: ambassadorId }})

  if (!ambassador) { return null }

  return models.Account.findOne({ where: { id: ambassador.account_id }})

}

export async function register(accountId: string, name?: string) {

  log.info('ambassadors.register', { accountId, name });

  let account = await models.Account.findOne({ where: { id: accountId }});

  if (!account) {

    throw new Error(`account ${accountId} not found`);

  }

  let resp = await models.Ambassador.create({ name, account_id: account.id });

  return resp;

}

export async function create(accountId, name?: string): Promise<any>{

  return register(accountId, name)

}

