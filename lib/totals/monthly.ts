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

export function forAccount(accountId: number) {

  return { forCurrency: forCurrencyForAccount(accountId) }
}

