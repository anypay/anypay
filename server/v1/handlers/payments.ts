
import * as Joi from 'joi'

import { log } from '../../../lib/log'

import { listPayments } from '../../../lib/payments'
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'
import { ResponseToolkit } from '@hapi/hapi'

import { payments as Payment } from '@prisma/client'
import { badRequest } from '@hapi/boom'
import prisma from '../../../lib/prisma'

export async function index(request: AuthenticatedRequest, h: ResponseToolkit) {

  try {

    let payments: any = await listPayments(request.account, {

      limit: request.query.limit || 1000,

      offset: request.query.offset || 0

    })

    payments = payments.map((payment: any) => {

      try {

        return {

          currency: payment.currency,

          chain: payment.chain,

          txid: payment.txid,

          createdAt: payment.createdAt,

          outputs: payment.option.outputs,

          invoice: {

            uid: payment.invoice.uid,

            amount: payment.invoice.denomination_amount,

            currency: payment.invoice.denomination_currency

          }

        }

      } catch(error: any) {

        log.error('listpayments', error)

      }

    })

    payments = payments.filter((payment: any) => !!payment)

    return h.response({

      payments

    })

  } catch(error: any) {

    log.error('api.v1.payments.index', error)

    return badRequest(error)

  }

}

interface Confirmation {
  
  chain: string;

  block_hash: string;

  block_height: number;

  block_index?: number;

  timestamp: Date;
}

export async function show(request: AuthenticatedRequest, h: ResponseToolkit) {

  const { invoice_uid } = request.params

  const payment = await prisma.payments.findFirstOrThrow({
    where: {
      invoice_uid: String(invoice_uid)
    }
  })

  const response: any = { payment }

  if (payment.confirmation_hash) {

    const confirmation: Confirmation = {
      block_hash: payment.confirmation_hash,
      block_height: Number(payment.confirmation_height),
      chain: payment.chain || payment.currency,
      timestamp: payment.createdAt
    };

    response.confirmation = confirmation

  }

  return response

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


