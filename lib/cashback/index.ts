
import * as database from "../database";

export async function getCustomerTotalsByMonth(currency: string): Promise<any> {

  let data = await database.query(
    `select extract(month from "createdAt") as mon,                
       extract(year from "createdAt") as yyyy,
       sum(amount), count(*) from cashback_customer_payments
       where currency = '${currency}'
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

export async function getMerchantTotalsByMonth(currency: string): Promise<any> {

  let data = await database.query(
    `select extract(month from "createdAt") as mon,                
       extract(year from "createdAt") as yyyy,
       sum(amount), count(*) from cashback_merchant_payments
       where currency = '${currency}'
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

export async function getCustomerTotalsAllTime(currency: string): Promise<number> {

  let customerPayments = await database.query(
    `select sum(amount) from cashback_customer_payments where currency = '${currency}'`
  );

  let amount = parseFloat(customerPayments[0][0].sum);

  if (amount > 0) {

    return amount;

  } else {

    return 0;

  }

}

export async function getMerchantTotalsAllTime(currency: string): Promise<number> {

  let merchantPayments = await database.query(
    `select sum(amount) from cashback_merchant_payments where currency = '${currency}'`
  );

  let amount = parseFloat(merchantPayments[0][0].sum);

  if (amount > 0) {

    return amount;

  } else {

    return 0;

  }

}

export async function listFailures(): Promise<any[]> {

  let result = await database.query(
    `select cashback_customer_payments.*, invoices.account_id from
    cashback_customer_payments inner join invoices on invoices.id =
    cashback_customer_payments.invoice_id where  invoices.status = 'paid' and
    invoices.cashback_denomination_amount > 0 and transaction_hash is null order
    by "createdAt" desc;`
  );

  return result[0];

}

