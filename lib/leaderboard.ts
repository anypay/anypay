
import { models } from './models';
import * as database from './database';

export interface LeaderboardSummary {
  one_payment: number;
  address_set: number;
  business_name: number;
  business_name_and_payment: number;
}

export interface Leaderboard {
  one_payment: any[];
  address_set: any[];
  business_name: any[];
  business_name_and_payment: any[];
}

function sanitize(array: any[]): any[] {

  return array.map(p => {
    return {
      business_name: p.business_name,
      count: p.count
    }
  });

}

export function sanitizeLeaderboard(l: Leaderboard): Leaderboard {

  return {
    one_payment: sanitize(l.one_payment),
    address_set: sanitize(l.address_set),
    business_name: sanitize(l.business_name),
    business_name_and_payment: sanitize(l.business_name_and_payment)
  };

}

export async function getLeaderboard() {

  let one_payment = await list();

  let address_set = await listAccountsAddressSet();

  let business_name = await listAccountWithBusinessName();

  return {
    one_payment: one_payment,
    address_set: address_set,
    business_name: business_name,
    business_name_and_payment: []
  }

}

export async function getSummary() {

  let one_payment = await list();

  let address_set = await listAccountsAddressSet();

  let business_name = await listAccountWithBusinessName();

  return {
    one_payment: one_payment.length,
    address_set: address_set.length,
    business_name: business_name.length,
    business_name_and_payment: []
  }

}

async function listAccountWithBusinessName() {

  let accountsBusinessName = await database.query(`select * from
      accounts where business_name is not null`);

  return accountsBusinessName[0];


}

async function listAccountsAddressSet() {

  let accountsAddressSet = await database.query(`select * from accounts where id in (select account_id from
      addresses group by account_id)`);

  return accountsAddressSet[0];
}

var leaderboardCache;

export async function updateCache() {

  let accountInvoicesCounts = await database.query(`select account_id, count(*) from
      invoices where status = 'paid' and "createdAt" > '07-01-2019' group by
      account_id order by count desc;`);


  let result = await Promise.all(accountInvoicesCounts[0].map(async (i) => {

    let account = await models.Account.findOne({where: { id: i.account_id }})

    return {
      count: i.count,
      account: account.toJSON()
    }

  }));

  leaderboardCache = result;

  return result;

}

export async function list() {
  
  if (!leaderboardCache) {

    await updateCache();
  }

  return leaderboardCache;

}
