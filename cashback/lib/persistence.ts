
import * as postgres from './postgres';

export async function recordMerchantCashback(changeset) {

  changeset.createdAt = new Date();
  changeset.updatedAt = new Date();

  let record = (await postgres('cashback_merchant_payments')
               .insert(changeset));

  if (!record) {
    throw new Error(`merchant cashback record not created`);
  }

  return record;

}

export async function recordCustomerCashback(changeset) {

  changeset.createdAt = new Date();
  changeset.updatedAt = new Date();

  let record = (await postgres('cashback_customer_payments')
               .insert(changeset));

  if (!record) {
    throw new Error(`merchant cashback record not created`);
  }

  return record;

}

