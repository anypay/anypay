
import * as Joi from 'joi'

import { log } from '../../../lib/log'

import { models } from '../../../lib/models'

import { listPayments } from '../../../lib/payments'

export async function index(req, h) {

  try {

    let payments: any = await listPayments(req.account, {

      limit: req.query.limit || 1000,

      offset: req.query.offset || 0

    })

    payments = payments.map(payment => {

      try {

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

      } catch(error) {

        log.error('listpayments', error)

      }

    })

    payments = payments.filter(payment => !!payment)

    return h.response({

      payments

    })

  } catch(error) {

    log.error('api.v1.payments.index', error)

    return h.badRequest(error)

  }

}

export async function show(req, h) {

  const { invoice_uid } = req.params

  const payment = await models.Payment.findsOne({ where: {
    invoice_uid
  }})

  return { payment }

}

const Payment = Joi.object({

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

})

export const Schema = {

  showPayment: Joi.object({

    payment: Payment

  }),

  listPayments: Joi.object({

    payments: Joi.array().items(Payment)

  })

}


