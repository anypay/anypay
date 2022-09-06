import { database, models } from '../../../lib';

import { Request, ResponseToolkit } from 'hapi';

import { listAll, listActiveSince as listActiveMerchantsSince } from '../../../lib/merchants'

export async function list(req: Request, h: ResponseToolkit) {

  let resp = await database.query(`select physical_address, business_name,
    latitude, longitude from accounts where physical_address is not null and
    business_name is not null`);

  h.response({ merchants: resp[0] })

}

export async function listMerchantCoins( req: Request, h:ResponseToolkit){

  let query = `select accounts.id, currency from accounts full join addresses on accounts.id = addresses.account_id where accounts.physical_address is not null and accounts.business_name is not null`

  let coinList = await database.query(query)

  return h.response(coinList[0])

}

export async function listActiveSince(req: Request, h: ResponseToolkit) {

  const oneWeek = await listActiveMerchantsSince(1, 'week')

  const oneMonth = await listActiveMerchantsSince(1, 'month')

  const threeMonths = await listActiveMerchantsSince(3, 'months')

  const merchants = await listAll()

  return h.response({

    merchants,

    oneWeek,

    oneMonth,

    threeMonths

  })

}

interface MerchantInfo {
  business_address: string;
  business_name: string;
  latitude: number;
  longitude: number;
  image_url: boolean;
  account_id: number;
  denomination: string;
}

export async function show(req, h) {

  return getMerchantInfo(req.params.account_id);

};

async function getMerchantInfo(accountId: any): Promise<MerchantInfo> {

  console.log("get merchant info", accountId);

  let account = await models.Account.findOne({where: {
    stub: accountId
  }})

  if (!account) {

    account = await models.Account.findOne({where: {

      id: parseInt(accountId)
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

