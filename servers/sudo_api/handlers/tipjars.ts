
import { log, tipjar } from '../../../lib';

export async function show(request, h) {

  return tipjar.getTipJarAndBalance(request.params.account_id, request.params.currency)

}

