
import {createConversion } from '../../../lib/prices';

import {Request} from '@hapi/hapi';

export async function show(request: Request) {

  let inputAmount = {

    currency: request.params.oldcurrency,

    value: parseFloat(request.params.oldamount)

  };

  let conversion = await createConversion(inputAmount, request.params.newcurrency);

  return {conversion};

}

