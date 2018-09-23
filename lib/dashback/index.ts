
import * as database from "../database";

export async function getCustomerTotalsByMonth(): Promise<any> {

  let data = await database.query(
    `select extract(month from "createdAt") as mon,                
       extract(year from "createdAt") as yyyy,
       sum(amount), count(*) from dash_back_customer_payments
     	group by 1,2;`
  );

  console.log('getcustomertotalsbymonth.result', data[0]);

  return data[0].map(item => {

    return {
      sum: parseFloat(item.sum),
      count: parseInt(item.count),
      mon: parseInt(item.mon),
      yyyy: parseInt(item.yyyy)
    }

  })

}

export async function getMerchantTotalsByMonth(): Promise<any> {

  let data = await database.query(
    `select extract(month from "createdAt") as mon,                
       extract(year from "createdAt") as yyyy,
       sum(amount), count(*) from dash_back_merchant_payments
     	group by 1,2;`
  );
  
  console.log('gemerchanttotalsbymonth.result', data[0]);

  return data[0].map(item => {

    return {
      sum: parseFloat(item.sum),
      count: parseInt(item.count),
      mon: parseInt(item.mon),
      yyyy: parseInt(item.yyyy)
    }

  })

}

export async function getCustomerTotalsAllTime(): Promise<number> {

  let customerPayments = await database.query(
    `select sum(amount) from dash_back_customer_payments`
  );

  let amount = parseFloat(customerPayments[0][0].sum);

  if (amount > 0) {

    return amount;

  } else {

    return 0;

  }

}

export async function getMerchantTotalsAllTime(): Promise<number> {

  let merchantPayments = await database.query(
    `select sum(amount) from dash_back_merchant_payments`
  );

  let amount = parseFloat(merchantPayments[0][0].sum);

  if (amount > 0) {

    return amount;

  } else {

    return 0;

  }

}

