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

    config: {

      auth: "accountToken",

      handler: handlers.Items.index

    }

  });

  server.route({

    method: "POST",

    path: "/grab-and-go/items",

    config: {

      auth: "accountToken",

      handler: handlers.Items.create

    }

  });

  server.route({

    method: "GET",

    path: "/grab-and-go/payments",

    config: {

      auth: "accountToken",

      handler: handlers.Payments.index

    }

  });

  server.route({

    method: "GET",

    path: "/grab-and-go/{account_stub}/{item_stub}/purchases/new",

    config: {

      handler: handlers.PaymentRequests.create

    }

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

