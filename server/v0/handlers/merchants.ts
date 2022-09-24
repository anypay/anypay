import { getMerchantInfo } from '../../../lib/merchants';

export async function show(req, h) {

  return getMerchantInfo(req.params.account_id);

};
