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

export async function claimBusiness(ambassadorEmail: string, merchantEmail: string) {

  let ambassadorAccount = await models.Account.findOne({ where: {

    email: ambassadorEmail

  }});

  if (!ambassadorAccount) {
    throw new Error(`account ${ambassadorEmail} not found`);
  }

  let ambassador = await models.Ambassador.findOne({

    where: {

      account_id: ambassadorAccount.id

    }

  });

  if (!ambassador) {
    throw new Error(`ambassador ${ambassadorEmail} not found`);
  }

  let merchantAccount = await models.Account.findOne({ where: {
  
    email: merchantEmail
    
  }});

  if (!merchantAccount) {
    throw new Error(`account ${merchantEmail} not found`);
  }

  let merchant = await models.DashBackMerchant.findOne({ where: {

    account_id: merchantAccount.id
    
  }});

  merchant.ambassador_id = ambassador.id;

  await merchant.save();

  return {

    ambassador: ambassador.toJSON(),

    merchant: merchant.toJSON()
    
  };

}

