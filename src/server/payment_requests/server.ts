require('dotenv').config()

import * as Hapi from '@hapi/hapi'

import { log } from '@/lib/log'


import { config } from '@/lib'

import * as handlers from '@/server/payment_requests/handlers'

export function attach(server: Hapi.Server) {

  /* Set Alternate Headers To Avoid BIP70 Binary vs JSON Data Type Conflict */
  server.ext('onRequest', function(request, h) {

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
    options: {
      payload: {
        output: 'data',
        parse: false
      },
      response: {
        schema: false,         // Indicate that the response schema should not be validated
      }
    }
  })
  /* END PAYMENT PROTOCOLS */

  return server

}

async function Server() {

  var server = new Hapi.Server({
    host: config.get('HOST'),
    port: config.get('PORT'),
    routes: {
      cors: true,
      validate: {
        options: {
          stripUnknown: true
        }
      },
    }
  })

  attach(server)

  return server

}

async function start(): Promise<Hapi.Server> {

  let server = await Server()

  await server.start()

  log.info(`hapi.server.started`, server.info)

  return server

}

if (require.main === module) {

  start()
}

export { Server, start }

