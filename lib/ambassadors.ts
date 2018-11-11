import { models, log } from './';

export async function listAll() {

  log.info('ambassadors.listall');

  let resp = await models.Ambassador.findAll();

  return resp;

}

export async function register(email: string, name?: string) {

  log.info('ambassadors.register', { email, name });

  let account = await models.Account.findOne({ where: { email }});

  if (!account) {

    throw new Error(`account ${email} not found`);

  }

  let resp = await models.Ambassador.create({ name, account_id: account.id });

  return resp;

}

