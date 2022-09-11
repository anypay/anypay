

import { jsonV2, failAction } from '../handlers'

import * as Joi from 'joi'

export async function attachRoutes(server) {

  server.route({
    method: "GET",
    path: "/i/{uid}",
    handler: jsonV2.Protocol.listPaymentOptions,
    options: {
      validate: {
        headers: Joi.object({
          'x-paypro-version': Joi.number().integer().required(),
          'accept': Joi.string().pattern(/application\/payment-options/).required()
        }).unknown(),
        params: Joi.object({
          uid: Joi.string().required()
        }),
        failAction
      }
    },
  });

  server.route({
    method: "POST",
    path: "/i/{uid}",
    handler: jsonV2.Protocol.handlePost,
    options: {
      validate: {
        headers: Joi.object({
          'x-paypro-version': Joi.number().integer().required(),
          'x-content-type': Joi.alternatives([
            Joi.string().pattern(/application\/payment-request/).required(),
            Joi.string().pattern(/application\/payment-verification/).required(),
            Joi.string().pattern(/application\/payment/).required(),
          ]).required()
        }).unknown(),
        params: Joi.object({
          uid: Joi.string().required()
        }),
        failAction
      }
    },
  });

  server.route({
    method: "POST",
    path: "/r/{uid}",
    handler: jsonV2.Protocol.handlePost,
    options: {
      validate: {
        headers: Joi.object({
          'x-paypro-version': Joi.number().integer().required(),
          'x-content-type': Joi.alternatives([
            Joi.string().pattern(/application\/payment-request/).required(),
            Joi.string().pattern(/application\/payment-verification/).required(),
            Joi.string().pattern(/application\/payment/).required(),
          ]).required()
        }),
        params: Joi.object({
          uid: Joi.string().required()
        }),
        failAction
      }
    },
  });

}
