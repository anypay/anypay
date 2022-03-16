
import {createConversion } from '../../../lib/prices';

import * as Joi from 'joi'

export async function show(req, h) {

  let inputAmount = {

    currency: req.params.old_currency,

    value: parseFloat(req.params.old_amount)

  };

  let conversion = await createConversion(inputAmount, req.params.new_currency);

  return { conversion }

}

export const Schema = {

  Conversion: Joi.object({

    input: Joi.object({

      currency: Joi.string().required(),

      value: Joi.number().required()

    }).required(),

    output: Joi.object({

      currency: Joi.string().required(),

      value: Joi.number().required()

    }).required(),

    timestamp: Joi.date().required()

  })

}
