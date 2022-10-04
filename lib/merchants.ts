
import { models } from './models';

import { log } from './log'

interface MerchantInfo {
  business_address: string;
  business_name: string;
  latitude: number;
  longitude: number;
  image_url: boolean;
  account_id: number;
  denomination: string;
}

export async function getMerchantInfo(identifier: any): Promise<MerchantInfo> {

  log.info('merchants.getMerchantInfo', { identifier })

  var account;

  try {
  
    await models.Account.findOne({where: {
      stub: identifier.toString()
    }})

  } catch(error) {

    log.error('merchants.getMerchantInfo.error', error)

  }

  if (!account) {

    account = await models.Account.findOne({where: {

      id: parseInt(identifier)
    }})

  }

  if (!account) {
    throw new Error('no account found');
  }

  return {
    business_name: account.business_name,
    business_address: account.business_address,
    latitude: parseFloat(account.latitude),
    longitude: parseFloat(account.longitude),
    image_url: account.image_url,
    account_id: account.id,
    denomination: account.denomination
  }

}