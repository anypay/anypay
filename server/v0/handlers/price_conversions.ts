
import {createConversion } from '../../../lib/prices';

export async function show(req, h) {

  let inputAmount = {

    currency: req.params.oldcurrency,

    value: parseFloat(req.params.oldamount)

  };

  let conversion = await createConversion(inputAmount, req.params.newcurrency)

  return {conversion}

}

