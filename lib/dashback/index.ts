
import * as database from "../database";

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

