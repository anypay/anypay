
import * as Joi from 'joi'

const PaymentOptionsHeaders = Joi.object({
  'x-paypro-version': Joi.number().integer().greater(1).less(3).optional(),
  'accept': Joi.string().pattern(/application\/payment-options/).required()
})

const PaymentOption = Joi.object({
  chain: Joi.string().required(),
  currency: Joi.string().required(),
  network: Joi.string().required(),
  estimatedAmount: Joi.number().integer().required(),
  requiredFeeRate: Joi.number().integer().required(),
  minerFee: Joi.number().integer().required(),
  decimals: Joi.number().integer().required(),
  selected: Joi.boolean().required()
})

const PaymentOptions = Joi.object({
  time: Joi.date().timestamp().required(),
  expires: Joi.date().timestamp().required(),
  memo: Joi.string().optional().allow('', null),
  paymentUrl: Joi.string().required(),
  paymentId: Joi.string().required(),
  paymentOptions: Joi.array().required().items(PaymentOption)
})

const PaymentRequestHeaders = Joi.object({
  'x-paypro-version': Joi.number().integer().greater(1).less(3).optional(),
  'x-content-type': Joi.string().pattern(/application\/payment-request/).optional()
})

const PaymentRequestReq = Joi.object({
  chain: Joi.string().required(),
  currency: Joi.string().required()
})

const AuthHeaders = Joi.object({
  'digest': Joi.string().required(),
  'x-identity': Joi.string().required(),
  'x-signature-type': Joi.string().required(),
  'x-signature': Joi.string().required()
})

const PaymentRequest = Joi.object({
  time: Joi.date().timestamp(),
  expires: Joi.date().timestamp(),
  memo: Joi.string().optional().allow('', null),
  paymentUrl: Joi.string().required(),
  paymentId: Joi.string().required(),
  chain: Joi.string().required(),
  network: Joi.string().required(),
  instructions: Joi.array()
})

const PaymentVerificationHeaders = Joi.object({
  'x-paypro-version': Joi.number().integer().greater(1).less(3).optional(),
  'x-content-type': Joi.string().pattern(/application\/payment-verification/).optional()
})

const PaymentVerificationReq = Joi.object({
  chain: Joi.string().required(),
  transactions: Joi.array().required().items(Joi.object({
    tx: Joi.string().required(),
    weightedSize: Joi.number().optional()
  })),
  currency: Joi.string().required()
})

const PaymentVerification = Joi.object({
  payment: Joi.object({
    currency: Joi.string(),
    chain: Joi.string(),
    transactions: Joi.array().required().items(Joi.object({
      tx: Joi.string().required()
    }))
  }),
  memo: Joi.string().optional().allow('', null)
})

const PaymentHeaders = Joi.object({
  'x-paypro-version': Joi.number().integer().greater(1).less(3).optional(),
  'x-content-type': Joi.string().pattern(/application\/payment/).optional()
})

const Payment = Joi.object({
  payment: Joi.object({
    chain: Joi.string().required(),
    transactions: Joi.array().required().items(Joi.object({
      tx: Joi.string().required(),
      weightedSize: Joi.number().optional(),
      tx_key: Joi.string().custom((value) => {
        return Buffer.byteLength(value, 'hex') === 32
      }).optional(),
      tx_hash: Joi.string().custom((value) => {
        return Buffer.byteLength(value, 'hex') === 32
      }).optional()
    })),
    currency: Joi.string().required()
  }).required(),
  memo: Joi.string().optional().allow('', null)
})

export const Protocol = {

  PaymentOptions: {
    headers: PaymentOptionsHeaders,
    request: {},
    response: PaymentOptions
  },
  PaymentRequest: {
    headers: PaymentRequestHeaders,
    request: PaymentRequestReq,
    response: PaymentRequest
  },

  PaymentVerification: {
    headers: PaymentVerificationHeaders,
    request: PaymentVerificationReq,
    response: PaymentVerification
  },

  Payment: {
    headers: PaymentHeaders,
    request: PaymentVerificationReq,
    response: Payment
  },

  AuthHeaders

}

