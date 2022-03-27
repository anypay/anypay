
import * as Joi from '@hapi/joi'

import { log } from '../../../lib/log'

import { badRequest } from 'boom'

import { listPayments } from '../../../lib/payments'

export async function index(req, h) {

  let payments: any = await listPayments(req.account, {

    limit: req.query.limit || 1000,

    offset: req.query.offset || 0

  })

  payments = payments.map(payment => {

    return {

      currency: payment.currency,

      txid: payment.txid,

      createdAt: payment.createdAt,

      outputs: payment.option.outputs,

      invoice: {

        uid: payment.invoice.uid,

        amount: payment.invoice.denomination_amount,

        currency: payment.invoice.denomination_currency

      }

    }

  })

  return h.response({

    payments

  })

}

export const Schema = {

  listPayments: Joi.object({

    payments: Joi.array().items(Joi.object({

      currency: Joi.string().required(),

      txid: Joi.string().required(),

      createdAt: Joi.date().required(),

      outputs: Joi.array().items(Joi.object({

        address: Joi.string().required(),

        amount: Joi.number().required()

      })),

      invoice: Joi.object({

        uid: Joi.string().required(),

        currency: Joi.string().required(),

        amount: Joi.number().required()

      })

    }))

  })

}


