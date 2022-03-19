require('dotenv').config()

import * as Hapi from 'hapi'

import { log } from '../../lib/log'

import { requireHandlersDirectory } from '../../lib/rabbi_hapi'

import { join } from 'path'

const handlers = requireHandlersDirectory(join(__dirname, './handlers'));

import * as jsonV2 from '../jsonV2/handlers/protocol'


export function attach(server: Hapi.Server) {

  /* Set Alternate Headers To Avoid BIP70 Binary vs JSON Data Type Conflict */
  server.ext('onRequest', function(request, h) {

    log.debug('server.request', { id: request.info.id, headers: request.headers })

    if ('application/payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment';
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

  /* PAYMENT PROTOCOLS */

  server.route({
    method: "POST",
    path: "/r/beta",
    handler: handlers.PaymentRequests.createBeta
  })

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
    path: "/r/{uid}/pay/{currency}/jsonv2",
    handler: handlers.JsonPaymentRequests.create
  })

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

async function Server() {

  var server = new Hapi.Server({
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 8000,
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

