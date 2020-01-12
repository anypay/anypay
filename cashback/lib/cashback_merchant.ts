
import * as postgres from './postgres';

export async function findCashbackMerchantByAccountId(accountId) {

  let cashbackMerchant = (await postgres('cashback_merchants')
               .select('*')
               .where('account_id', accountId)
               .limit(1))[0]

  if (!cashbackMerchant) {
    throw new Error(`cashbackMerchant ${accountId} not found`);
  }

  return cashbackMerchant;

}
