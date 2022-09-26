require('dotenv').config()

import * as Hapi from '@hapi/hapi'

import { log } from '../../lib/log'

import { requireHandlersDirectory } from '../../lib/rabbi_hapi'

import { join } from 'path'

const handlers = requireHandlersDirectory(join(__dirname, './handlers'));

import { failAction } from '../handlers'

import * as Joi from 'joi'

export function attach(server: Hapi.Server) {

  /* Set Alternate Headers To Avoid BIP70 Binary vs JSON Data Type Conflict */
  server.ext('onRequest', function(request, h) {

    log.debug('server.request', { id: request.info.id, headers: request.headers })

    if ('application/payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment';
    }

    if ('application/payment-request' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment-request';
    }

    if ('application/payment-verification' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment-verification';
    }

    if ('application/payment' === request.headers['accept']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment';
    }

    if ('application/bitcoinsv-payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/bitcoinsv-payment';
    }

    if ('application/dash-payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/dash-payment';
    }

    if ('application/dash-payment' === request.headers['accept']) {
      request.headers['accept'] = 'application/json';
      request.headers['x-accept'] = 'application/dash-payment';
    }

    if ('application/dash-paymentack' === request.headers['accept']) {
      request.headers['accept'] = 'application/json';
      request.headers['x-accept'] = 'application/dash-paymentack';
    }

    if ('application/bitcoinsv-paymentack' === request.headers['accept']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/bitcoinsv-payment';
      request.headers['x-accept'] = 'application/bitcoinsv-paymentack';
    }

    if ('application/verify-payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/verify-payment';
    }

    if ('application/verify-payment' === request.headers['accept']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/verify-payment';
    }

    return h.continue;
  });

  server.ext('onRequest', function(request, h) {

    if ('application/payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment';
    }

    return h.continue;
  });


  /* PAYMENT PROTOCOLS */

  /* PAYMENT REQUESTS
   *
   * View a Payment Request Using Either Of Several Protocols
   *
   *   - BIP70,
   *   - BIP270,
   *   - JSON
   *
   */
  server.route({
    method: "GET",
    path: "/r/{uid}",
    handler: handlers.PaymentRequests.show 
  })

  
  server.route({
    method: "GET",
    path: "/i/{uid}",
    handler: handlers.Jsonv2Protocol.listPaymentOptions,
    options: {
      tags: ['api', 'platform', 'jsonv2'],
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
    handler: handlers.Jsonv2Protocol.handlePost,
    options: {
      tags: ['api', 'platform', 'jsonv2'],
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
    handler: handlers.Jsonv2Protocol.handlePost,
    options: {
      tags: ['api', 'platform', 'jsonv2'],
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

  /* PAYMENT SUBMISSION */

  server.route({
    method: "POST",
    path: "/r/{uid}/pay/{currency}/bip270",
    handler: handlers.Bip270PaymentRequests.create 
  })

  server.route({
    method: "POST",
    path: "/r/{uid}/pay/{currency}/bip70",
    handler: handlers.Bip70PaymentRequests.create,
    config: {
      payload: {
        output: 'data',
        parse: false
      }
    }
  })

  /* END PAYMENT PROTOCOLS */

  return server

}

