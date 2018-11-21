import * as database from '../database';

function forCurrencyForAccount(accountId: number)  {

  return async function(currency: string) {

    const query = `select extract(month from "createdAt") as mon,
      extract(year from "createdAt") as yyyy,
      sum("amount") as "total"
      from invoices
      where status = 'paid'
      and account_id = ${accountId}
      and currency = '${currency}'
      group by 1,2;`;

    var result = await database.query(query);

    return result[0].map(res => {
      return {
        month: res.mon,
        year: res.yyyy,
        total: parseFloat(res.total)
      }
    });
  }
}

function countForCurrencyForAccount(accountId: number)  {

  return async function(currency: string) {

    const query = `select extract(month from "createdAt") as mon,
      extract(year from "createdAt") as yyyy,
      sum(1) as "total"
      from invoices
      where status = 'paid'
      and account_id = ${accountId}
      and currency = '${currency}'
      group by 1,2;`;

    var result = await database.query(query);

    return result[0].map(res => {
      return {
        month: res.mon,
        year: res.yyyy,
        total: parseFloat(res.total)
      }
    });
  }
}

export async function globalTotalsForCurrency(currency: string) {

  const query = `select extract(month from "createdAt") as mon,
    extract(year from "createdAt") as yyyy,
    sum(1) as "total"
    from invoices
    where status = 'paid'
    and currency = '${currency}'
    group by 1,2;`;

  var result = await database.query(query);

  return result[0].map(res => {
    return {
      month: res.mon,
      year: res.yyyy,
      total: parseFloat(res.total)
    }
  });
}

export function forAccount(accountId: number) {

  return {
    forCurrency: forCurrencyForAccount(accountId),
    countForCurrency: countForCurrencyForAccount(accountId)
  }
}

export async function totalTransactions() {

  const query = `select extract(month from "createdAt") as mon,
    extract(year from "createdAt") as yyyy,
    sum(1) as "total"
    from invoices
    where status = 'paid'
    group by 1,2;`;

  var result = await database.query(query);

  return result[0].map(res => {
    return {
      month: res.mon,
      year: res.yyyy,
      total: parseFloat(res.total)
    }
  });

}


export async function totalTransactionsByCoin(coin: string) {

  const query = `select extract(month from "createdAt") as mon,
    extract(year from "createdAt") as yyyy,
    sum(1) as "total"
    from invoices
    where status = 'paid'
    and currency = '${coin}'
    group by 1,2;`;

  var result = await database.query(query);

  return result[0].map(res => {
    return {
      month: res.mon,
      year: res.yyyy,
      total: parseFloat(res.total)
    }
  });

}

export async function totalByDenominationForCurrencyInPeriod(
  currency: string,
  periodStart: string,
  periodEnd: string
) {

  const query = `select denomination_currency, count(*) from invoices
    where status = 'paid'	
    and invoice_currency = '${currency}'
    and "createdAt" >= '${periodStart}'
    and "createdAt" < '${periodEnd}'
    group by denomination_currency
    order by count desc;`;

  var result = await database.query(query);

  return result[0];

}

export async function totalByDenominationInPeriod(
  periodStart: string,
  periodEnd: string
) {

  const query = `select denomination_currency, count(*) from invoices
    where status = 'paid'	
    and "createdAt" >= '${periodStart}'
    and "createdAt" < '${periodEnd}'
    group by denomination_currency
    order by count desc;`;

  var result = await database.query(query);

  return result[0];

}
