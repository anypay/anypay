
import * as Joi from 'joi'

const PaymentOptionsHeaders = Joi.object({
  'x-paypro-version': Joi.number().integer().greater(1).less(3).required(),
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
  memo: Joi.string().required(),
  paymentUrl: Joi.string().required(),
  paymentId: Joi.string().required(),
  paymentOptions: Joi.array().required().items(PaymentOption)
})

const PaymentRequestHeaders = Joi.object({
  'x-paypro-version': Joi.number().integer().greater(1).less(3).required(),
  'x-content-type': Joi.string().pattern(/application\/payment-request/).required()
})

const PaymentRequestReq = Joi.object({
  chain: Joi.string().required(),
  currency: Joi.string().required()
})

const Instruction = Joi.object({
  type: Joi.string().required()
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
  memo: Joi.string().required(),
  paymentUrl: Joi.string().required(),
  paymentId: Joi.string().required(),
  chain: Joi.string().required(),
  network: Joi.string().required(),
  instructions: Joi.array()
})

const PaymentVerificationHeaders = Joi.object({
  'x-paypro-version': Joi.number().integer().greater(1).less(3).required(),
  'x-content-type': Joi.string().pattern(/application\/payment-verification/).required()
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
  memo: Joi.string().required()
})

const PaymentHeaders = Joi.object({
  'x-paypro-version': Joi.number().integer().greater(1).less(3).required(),
  'x-content-type': Joi.string().pattern(/application\/payment/).required()
})

const Payment = Joi.object({
  payment: Joi.object({
    chain: Joi.string().required(),
    transactions: Joi.array().required().items(Joi.object({
      tx: Joi.string().required(),
      weightedSize: Joi.number().required()
    })),
    currency: Joi.string().required()
  }).required(),
  memo: Joi.string().required()
})

const SigningKeys = Joi.object({
  owner: Joi.string().required(),
  expirationDate: Joi.date().timestamp().required(),
  validDomains: Joi.array().required().items(Joi.string()),
  publicKeys: Joi.array().required().items(Joi.string())
})

const KeySignatures = Joi.object({
  keyHash: Joi.string().required(),
  signatures: Joi.array().required().items(Joi.object({
    created: Joi.date().timestamp().required(),
    identifier: Joi.string().required(),
    signature: Joi.string().required()
  }))
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

