require('dotenv').config()

import { join } from 'path';

import * as Hapi from 'hapi';

import { logInfo } from '../../lib/logger';

import { requireHandlersDirectory } from 'rabbi';

import { validateToken } from '../auth/hapi_validate_token';

const handlers = requireHandlersDirectory(join(__dirname, 'handlers'))

function attach(server: Hapi.Server): Hapi.Server {

  server.route({

    method: "GET",

    path: "/grab-and-go/items",

    options: {

      auth: "token"

    },

    handler: handlers.Items.index

  });

  server.route({

    method: "POST",

    path: "/grab-and-go/items",

    handler: handlers.Items.create,

    options: {

      auth: "token"

    }

  });

  server.route({

    method: "GET",

    path: "/grab-and-go/{account_stub}/{item_stub}",

    handler: handlers.PaymentRequests.create

  });

  server.route({

    method: "GET",

    path: "/gg/{item_uid}",

    handler: handlers.PaymentRequests.createByItemUid

  });

  server.route({

    method: "GET",

    path: "/g/{item_uid}",

    handler: handlers.PaymentRequests.createByItemUid

  });

  server.route({

    method: "GET",

    path: "/{item_uid}",

    handler: handlers.PaymentRequests.createByItemUid

  });


  server.route({

    method: "POST",

    path: "/payments/edge/{currency}/{uid}",

    handler: handlers.PaymentRequests.submitPayment

  });

  return server

}

async function Server(): Promise<Hapi.Server> {

  var server = new Hapi.Server({
    host: "0.0.0.0",
    port:  process.env.PORT || 5200,
    routes: {
      cors: true,
      validate: {
        options: {
          stripUnknown: true
        }
      }
    }
  });

  await server.register(require('hapi-auth-basic'));

  server.ext('onRequest', function(request, h) {

    if ('application/payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment';
    }

    if ('application/payment-request' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment-request';
    }

    return h.continue;

  });


  return server;

}

async function start() {


  try {

    let server = await Server();

    server.auth.strategy("token", "basic", { validate: validateToken});

    attach(server)

  // Start the server
    await server.start();

    logInfo("servers.grab-and-go.started", server.info);

   } catch(err){

     console.log(err)

   }

}

if (require.main === module) {

  start()

}

export {

  start,

  attach,

  Server

}

