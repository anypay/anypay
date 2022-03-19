
const sequelize = require("../../lib/database");

import { jsonV2 } from '../handlers'

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
        }),
        params: Joi.object({
          uid: Joi.string().required()
        })
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
        }),
        params: Joi.object({
          uid: Joi.string().required()
        })
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
        })
      }
    },
  });

}
