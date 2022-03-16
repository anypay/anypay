
import { discount } from '../../../lib';

import { cleanObjectKeys as clean } from '../../../lib/utils'

import * as Joi from 'joi'

export async function update(req, h) {

  let result = await discount.set({

    account_id: req.account.id,

    currency: req.params.currency,

    percent: req.payload.percent

  })

  return h.response({ discount: clean(result.toJSON()) })

}

export const Schema = {

  Discount: Joi.object({

    id: Joi.number().required(),

    account_id: Joi.number().required(),

    percent: Joi.number().required(),

    currency: Joi.string().required(),

    createdAt: Joi.date().required(),

    updatedAt: Joi.date().required(),

  })

}
