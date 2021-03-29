require('dotenv').config()

import { join } from 'path';

import * as Hapi from 'hapi';

import { logInfo } from '../../lib/logger';

import { requireHandlersDirectory } from 'rabbi';

import { validateToken } from '../auth/hapi_validate_token';

const handlers = requireHandlersDirectory(join(__dirname, 'handlers'))

function attach(server: Hapi.Server): Hapi.Server {

  server.auth.strategy("accountToken", "basic", { validate: validateToken});

  server.route({

    method: "GET",

    path: "/x/balance/{month}-{day}-{year}",

    options: {

      auth: "accountToken"

    },

    handler: handlers.Balance.show

  });

  server.route({

    method: "GET",

    path: "/x/reports/{month}-{year}",

    options: {

      auth: "accountToken"

    },

    handler: handlers.Reports.show

  });

  server.route({

    method: "POST",

    path: "/x/debits",

    options: {

      auth: "accountToken"

    },

    handler: handlers.Transactions.create

  });

  server.route({

    method: "GET",

    path: "/x/account",

    options: {

      auth: "accountToken"

    },

    handler: handlers.Accounts.show

  });

  server.route({

    method: "GET",

    path: "/x/transactions",

    options: {

      auth: "accountToken"

    },

    handler: handlers.Transactions.index

  });

  return server

}

async function Server(): Promise<Hapi.Server> {

  var server = new Hapi.Server({
    host: "0.0.0.0",
    port:  process.env.PORT || 5210,
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

  attach(server)

  return server;

}

async function start() {
  logInfo("servers.anypayx.start");

  try {

    let server = await Server();

  // Start the server
    await server.start();

    logInfo("servers.anypayx.started", server.info);

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

