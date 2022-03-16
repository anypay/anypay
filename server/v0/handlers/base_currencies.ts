
import { badRequest } from 'boom'

import * as Joi from 'joi'

import { getCurrencies } from '../../../lib/prices/fixer'

export async function index(req, h) {

  var currencies = await getCurrencies();

  return { currencies };

}

export const Schema = {

  Currency: Joi.object({

    base_currency: Joi.string().required(),

    currency: Joi.string().required(),

    value: Joi.number().required(),

    source: Joi.string().required()

  })

}

