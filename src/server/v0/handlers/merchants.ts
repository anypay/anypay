import { Request } from '@hapi/hapi';
import { getMerchantInfo } from '@/lib/merchants';

export async function show(request: Request) {

  return getMerchantInfo(request.params.account_id);

};