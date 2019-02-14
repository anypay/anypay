import { database } from '../../../lib';

import * as moment from 'moment';

import { Request, ResponseToolkit } from 'hapi';

export async function list(req: Request, h: ResponseToolkit) {

  let resp = await database.query(`select physical_address, business_name,
    latitude, longitude from accounts where physical_address is not null and
    business_name is not null`);

  return { merchants: resp[0] };

}
export async function listActiveSince(req: Request, h: ResponseToolkit) {

  try {

  let today = moment();

  let oneWeekAgo = moment().subtract(1, 'week').format('MM-DD-YYYY');
  let oneMonthAgo = moment().subtract(1, 'month').format('MM-DD-YYYY');
  let threeMonthsAgo = moment().subtract(3, 'months').format('MM-DD-YYYY');

  let query = `select accounts.id from accounts inner join invoices on accounts.id = invoices.account_id where invoices."createdAt" > '${oneWeekAgo}' and accounts.physical_address is not null and accounts.business_name is not null group by accounts.id`;
  console.log(query);
  let accountIdsOneWeek = await database.query(query);

  query = `select accounts.id from accounts inner join invoices on accounts.id = invoices.account_id where invoices."createdAt" > '${oneMonthAgo}' and accounts.physical_address is not null and accounts.business_name is not null group by accounts.id`
  console.log(query);
  let accountIdsOneMonth = await database.query(query);

  query = `select accounts.id from accounts inner join invoices on accounts.id = invoices.account_id where invoices."createdAt" > '${threeMonthsAgo}' and accounts.physical_address is not null and accounts.business_name is not null group by accounts.id`;
  console.log(query);
  let accountIdsThreeMonths = await database.query(query);

  let allVerifiedMerchants = await database.query(`select physical_address, business_name, id,
    latitude, longitude from accounts where physical_address is not null and
    business_name is not null`);

  return {
    merchants: allVerifiedMerchants[0],
    oneWeek: accountIdsOneWeek[0],
    oneMonth: accountIdsOneMonth[0],
    threeMonths: accountIdsThreeMonths[0]
  };

  } catch (error) {

    return { error: error.message }

  }

}
