require('dotenv').config()

import { join } from 'path';

import * as Hapi from 'hapi';

import { log } from '../../lib';

import { requireHandlersDirectory } from 'rabbi';

import { validateToken } from '../auth/hapi_validate_token';

const handlers = requireHandlersDirectory(join(__dirname, 'handlers'))

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

  server.auth.strategy("accountToken", "basic", { validate: validateToken});

  server.route({

    method: "GET",

    path: "/grab-and-go/items",

    options: {

      auth: "accountToken"

    },

    handler: handlers.Items.index

  });

  server.route({

    method: "POST",

    path: "/grab-and-go/items",

    handler: handlers.Items.create,

    options: {

      auth: "accountToken"

    }

  });

  server.route({

    method: "GET",

    path: "/grab-and-go/payments",

    options: {

      auth: "accountToken"

    },

    handler: handlers.Payments.index

  });

  server.route({

    method: "GET",

    path: "/grab-and-go/{account_stub}/{item_stub}",

    handler: handlers.PaymentRequests.create

  });


  server.route({

    method: "POST",

    path: "/grab-and-go/square/oauth/codes",

    handler: handlers.SquareOauthCodes.create,

    options: {

      auth: "accountToken"

    }

  });

  server.route({

    method: "GET",

    path: "/grab-and-go/auth/square",

    handler: handlers.SquareOauth.authorize

  });

  server.route({

    method: "GET",

    path: "/{item_uid}",

    handler: handlers.PaymentRequests.createByItemUid

  });

  server.route({

    method: "GET",

    path: "/gg/{item_uid}",

    handler: handlers.PaymentRequests.createByItemUid

  });

  server.route({

    method: "GET",

    path: "/gg/dash/{item_uid}",

    handler: handlers.DashPaymentRequests.createByItemUid

  });

  return server;

}

async function start() {

  try {

    let server = await Server();

  // Start the server
    await server.start();

    log.info("Server running at:", server.info.uri);

   } catch(err){

     console.log(err)

   }

}

if (require.main === module) {

  start()

}

export {

  start,

  Server

}

