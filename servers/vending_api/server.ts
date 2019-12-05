require('dotenv').config();
import * as Hapi from "hapi";
const Joi = require('joi');
import { log, models, auth } from '../../lib';
const VendingMachineTransactions = require("./handlers/vending_transactions");

const kBadRequestSchema = Joi.object({
  statusCode: Joi.number().integer().required(),
  error: Joi.string().required(),
  message: Joi.string().required()
}).label('BoomError')

function responsesWithSuccess({ model }) {
  return {
    'hapi-swagger': {
      responses: {
        200: {
          description: 'Success',
          schema: model
        },
        400: {
          description: 'Bad Request',
          schema: kBadRequestSchema,
        },
        401: {
          description: 'Unauthorized',
          schema: kBadRequestSchema,
        },
      },
    },
  }
}

async function Server() {

  var server = new Hapi.Server({
    host: process.env.HOST || "localhost",
    port: process.env.VENDING_PORT || 8200,
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
  server.auth.strategy("token", "basic", { validate: auth.validateToken });
  server.auth.strategy("sudopassword", "basic", { validate: auth.validateSudoPassword});

  server.route({

    method: 'GET',

    path: '/api/vending/vending_machine/{serial_number}/transactions',

    config: { auth : "sudopassword" },

    handler: VendingMachineTransactions.getMachineTransactions

  })

  server.route({

    method: 'GET',

    path: '/api/vending/transactions',

    config: { auth : "sudopassword" },

    handler:  VendingMachineTransactions.getLatestTransactions

  })

  server.route({

    method: 'GET',

    path: '/api/vending/transactions/kpis/revenue',

    config: { auth : "sudopassword" },

    handler:  VendingMachineTransactions.getRevenue

  })

  server.route({

    method: 'GET',

    path: '/api/vending/account/transactions/kpis/revenue',

    config: { auth : "token" },

    handler:  VendingMachineTransactions.getAccountRevenue

  })

  server.route({

    method: 'GET',

    path: '/api/vending/transactions/kpis/profit',

    config: { auth : "sudopassword" },

    handler:  VendingMachineTransactions.getProfit

  })

  server.route({

    method: 'GET',

    path: '/api/vending/account/transactions/kpis/profit',

    config: { auth : "token" },

    handler:  VendingMachineTransactions.getAccountProfit

  })

  server.route({

    method: 'GET',

    path: '/api/vending/account/transactions',

    config: { auth : "token" },

    handler: VendingMachineTransactions.getAccountTransactions

  })

  return server;

}


if (require.main === module) {

  start();
}

async function start () {

  var server = await Server();

  // Start the server
  await server.start();

  log.info("Server running at:", server.info.uri);

}

export { Server, start }

