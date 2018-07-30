
import * as database from "../database";

export async function getCustomerTotalsAllTime(): Promise<number> {

  let customerPayments = await database.query(
    `select sum(amount) from dash_back_customer_payments`
  );

  return parseFloat(customerPayments[0][0].sum);

}

export async function getMerchantTotalsAllTime(): Promise<number> {

  let merchantPayments = await database.query(
    `select sum(amount) from dash_back_customer_payments`
  );

  return parseFloat(merchantPayments[0][0].sum);

}

