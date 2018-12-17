import { models, log } from '../../../lib';

export async function sudoList(request) {

  return models.DashBackMerchant.findAll({ where: { enabled: true }});

}

export async function sudoShow(request) {

  let account = await models.Account.findOne({ where: {
    email: request.params.email
  }});

  if(!account) {

    log.error(`account not found ${request.params.email}`);

    return {
      success: false,
      error: `account not found ${request.params.email}`
    }

  }

  let merchant = await models.DashBackMerchant.findOne({ where: {
    account_id: account.id 
  }});

  return {
    success: true,
    merchant
  }

}

export async function sudoActivate(request) {

  let account = await models.Account.findOne({ where: {
    email: request.params.email
  }});

  if(!account) {

    log.error(`account not found ${request.params.email}`);

    return {
      success: false,
      error: `account not found ${request.params.email}`
    }

  }

  let merchant = await models.DashBackMerchant.findOne({ where: {

    account_id: account.id

  }});

  if (!merchant) {

    await models.DashBackMerchant.create({
      account_id: account.id,
      enabled: true
    });

  } else {

    merchant.enabled = true;
    await merchant.save();

  }

  return {
    success: true
  }

}

export async function sudoDeactivate(request) {

  let account = await models.Account.findOne({ where: {
    email: request.params.email
  }});

  if(!account) {

    log.error(`account not found ${request.params.email}`);

    return {
      success: false,
      error: `account not found ${request.params.email}`
    }

  }

  let merchant = await models.DashBackMerchant.findOne({ where: {

    account_id: account.id

  }});

  if (!merchant) {

    await models.DashBackMerchant.create({
      account_id: account.id,
      enabled: false
    });

  } else {

    merchant.enabled = false;
    await merchant.save();

  }

  return {
    success: true
  }

}

