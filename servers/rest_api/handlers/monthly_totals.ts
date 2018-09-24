import * as database from '../../../lib/database';
import * as logger from 'winston';
import {globalTotalsForCurrency} from '../../../lib/totals/monthly';
import {monthly} from '../../../lib/totals';

export async function usd() {

  const query = `select extract(month from "createdAt") as mon,
    extract(year from "createdAt") as yyyy,
    sum("dollar_amount") as "usd"
    from invoices
    where status = 'paid'
    group by 1,2;`;

  try {

    var result = await database.query(query);

    return result[0];

  } catch(error){ 

    logger.error(error.message);

    throw error;
  }
}

export async function btc() {

  const query = `select extract(month from "createdAt") as mon,
    extract(year from "createdAt") as yyyy,
    sum("amount") as "btc"
    from invoices
    where status = 'paid'
    and currency = 'BTC'
    group by 1,2;`;

  try {

    var result = await database.query(query);

    return result[0];

  } catch(error){ 

    logger.error(error.message);

    throw error;
  }

}

export async function dash() {

  const query = `select extract(month from "createdAt") as mon,
    extract(year from "createdAt") as yyyy,
    sum("amount") as "dash",
    sum(1) as "payments"
    from invoices
    where status = 'paid'
    and currency = 'DASH'
    group by 1,2;`;

  try {

    var result = await database.query(query);

    return result[0];

  } catch(error){ 

    logger.error(error.message);

    throw error;
  }

}

export async function bch() {

  const query = `select extract(month from "createdAt") as mon,
    extract(year from "createdAt") as yyyy,
    sum("amount") as "bch"
    from invoices
    where status = 'paid'
    and currency = 'BCH'
    group by 1,2;`;

  try {

    var result = await database.query(query);

    return result[0];

  } catch(error){ 

    logger.error(error.message);

    throw error;
  }
}

export async function total() {

  const query = `select extract(month from "createdAt") as mon,
    extract(year from "createdAt") as yyyy,
    sum(1) as "total"
    from invoices
    where status = 'paid'
    group by 1,2;`;

  try {

    var result = await database.query(query);

    return result[0];

  } catch(error){ 

    logger.error(error.message);

    throw error;
  }
}

export async function count() {

  let dashCountsByMonth = await globalTotalsForCurrency('DASH');

  return {
    'DASH': dashCountsByMonth
  };
}

export async function totalTransactionsByCoin(req, h) {

  console.log("PARAMS", req.params);

  let coin = req.params.coin.toUpperCase();

  let totals = await monthly.totalTransactionsByCoin(coin);

  let response = {};

  response[coin] = totals;

  return response;
}

