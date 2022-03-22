import { database } from '../../../lib';

import * as moment from 'moment';

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

