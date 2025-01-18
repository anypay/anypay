

import { Server } from '@hapi/hapi';
import { jsonV2, failAction } from '@/server/handlers'

import * as Joi from 'joi'

export async function attachRoutes(server: Server) {

  server.route({
    method: "GET",
    path: "/i/{uid}",
    handler: jsonV2.Protocol.listPaymentOptions,
    options: {
      tags: ['api', 'platform', 'jsonv2'],
      validate: {
        headers: Joi.object({
          'x-paypro-version': Joi.number().integer().optional(),
          'accept': Joi.string().pattern(/application\/payment-options/).required()
        }).unknown().label('ListPaymentOptionsRequest'),
        params: Joi.object({
          uid: Joi.string().required()
        }).label('ListPaymentOptionsRequest'),
        failAction
      }
    },
  });

  server.route({
    method: "POST",
    path: "/i/{uid}",
    handler: jsonV2.Protocol.handlePost,
    options: {
      tags: ['api', 'platform', 'jsonv2'],
      validate: {
        headers: Joi.object({
          'x-paypro-version': Joi.number().integer().optional(),
          'x-content-type': Joi.alternatives([
            Joi.string().pattern(/application\/payment-request/).required(),
            Joi.string().pattern(/application\/payment-verification/).required(),
            Joi.string().pattern(/application\/payment/).required(),
          ]).required()
        }).unknown().label('HandlePostRequest'),
        params: Joi.object({
          uid: Joi.string().required()
        }).label('HandlePostRequest'),
        failAction: 'log'
      }
    },
  });

  server.route({
    method: "POST",
    path: "/r/{uid}",
    handler: jsonV2.Protocol.handlePost,
    options: {
      tags: ['api', 'platform', 'jsonv2'],
      validate: {
        headers: Joi.object({
          'x-paypro-version': Joi.number().integer().optional(),
          'x-content-type': Joi.alternatives([
            Joi.string().pattern(/application\/payment-request/).required(),
            Joi.string().pattern(/application\/payment-verification/).required(),
            Joi.string().pattern(/application\/payment/).required(),
          ]).required()
        }).label('HandlePostRequest'),
        params: Joi.object({
          uid: Joi.string().required()
        }).label('HandlePostRequest') ,
        failAction: 'log'
      }
    },
  });

}
