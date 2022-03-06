
import { Account } from './account'

import * as moment from 'moment'

import { database } from './'

export enum timespans {

  OneWeek = 'one-week',

  OneMonth = 'one-month',

  ThreeMonths = 'three-months',

  Inactive = 'inactive'

}

class Merchant {

  active_since: Date;

  business_name: string;

  physical_address: string;

  website_url: string;

  account: Account;

}

export async function listActiveSince(units: any, span: string): Promise<Merchant[]> {

  let today = moment();

  let date = moment().subtract(units, span).format('MM-DD-YYYY');

  let query = `select accounts.id from accounts inner join invoices on accounts.id = invoices.account_id where invoices."createdAt" > '${date}' and status='paid' and accounts.physical_address is not null and accounts.business_name is not null group by accounts.id`;

  let [ids] = await database.query(query);

  ids = ids.map(record => record.id)

  if (ids.length === 0) { return [] }

  let [merchants] = await database.query(`select physical_address, business_name, id, latitude, longitude, image_url from accounts where id in (${ids.join(', ')});`)


  return merchants

}

export async function listAll(): Promise<Merchant[]> {

  let [merchants] = await database.query(`select physical_address, business_name, id,
    latitude, longitude, image_url from accounts where physical_address is not null and
    business_name is not null`);

  return merchants
}



