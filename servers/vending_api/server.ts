require('dotenv').config();
import * as Hapi from "hapi";
const Joi = require('joi');
import { log, models, auth } from '../../lib';
const VendingMachineTransactions = require("./handlers/vending_transactions");
import * as vendingMachines from './handlers/vending_machines';

const HapiSwagger = require('hapi-swagger');

const Inert = require('inert');
const Vision = require('vision');

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

const swaggerOptions = {
    info: {
        title: 'Anypay Kiosk Api',
        version: '0.0.1',
    }
};



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

 await server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions
        }
  ]);


  await server.register(require('hapi-auth-basic'));
  server.auth.strategy("token", "basic", { validate: auth.validateToken });
  server.auth.strategy("sudopassword", "basic", { validate: auth.validateSudoPassword});

  server.route({

    method: 'GET',

    path: '/api/vending/transactions',

    options: {

      handler:  VendingMachineTransactions.getLatestTransactions,

      auth : "sudopassword",

      tags: ['api'],

      description: 'returns all vending machine transactions',

    }

  })

  server.route({

    method: 'GET',

    path: '/api/vending/vending_machines',

    options: {

      handler:  vendingMachines.index,

      auth : "sudopassword", 

      tags: ['api'],

      description: 'returns list of vending machines',

    }

  })


  server.route({

    method: 'PUT',

    path: '/api/vending/vending_machines/{id}/toggleStrategy',
 
    options: {

      handler:  vendingMachines.toggleStrategy,

      auth : "sudopassword",

      tags: ['api'],

      description: 'Toggles Vending Machine Output Strategy ID between 0 and 1',

    }

  })

  server.route({

    method: 'GET',

    path: '/api/vending/vending_machines/{id}',

    options: {

      handler:  vendingMachines.show,

      auth : "sudopassword",

      tags: ['api'],

      description: 'Returns details of vending machine by id',

    }

  })


  server.route({

    method: 'GET',

    path: '/api/vending/transactions/kpis/revenue',

    options: {

      handler:  VendingMachineTransactions.getRevenue,

      auth : "sudopassword",

      tags: ['api'],

      description: 'Returns the volume of all vending machines by last 24 hours, last week, last month and all time',

    }

  })

  server.route({

    method: 'GET',

    path: '/api/vending/account/transactions/kpis/revenue',

    options: {

      handler:  VendingMachineTransactions.getAccountRevenue,

      auth : "token",

      tags: ['api'],

      description: 'Returns the volume of all vending machines by last 24 hours, last week, last month and all time by account'

    }

  })


  server.route({

    method: 'GET',

    path: '/api/vending/account/{account_id}/transactions/kpis/revenue',

    options: {

      handler:  VendingMachineTransactions.getAccountRevenue,

      auth : "sudopassword",

      tags: ['api'],

      description: 'Returns the volume of all vending machines by last 24 hours, last week, last month and all time by account'

    }

  })

  server.route({

    method: 'GET',

    path: '/api/vending/transactions/kpis/profit',

    options: {

      handler:  VendingMachineTransactions.getProfit,

      auth : "sudopassword",

      tags: ['api'],

      description: 'Returns the spread captured of all vending machines by last 24 hours, last week, last month and all time'

    }

  })

  server.route({

    method: 'GET',

    path: '/api/vending/account/transactions/kpis/profit',

    options: {

      handler:  VendingMachineTransactions.getAccountProfit,

      auth : "token",

      tags: ['api'],

      description: 'Returns the spread captured of all vending machines by last 24 hours, last week, last month and all time by account'

    }

  })

  server.route({

    method: 'GET',

    path: '/api/vending/account/{account_id}/transactions/kpis/profit',

    options: {

      handler:  VendingMachineTransactions.getAccountProfit,

      auth : "sudopassword",

      tags: ['api'],

      description: 'Returns the spread captured of all vending machines by last 24 hours, last week, last month and all time by account'

    }

  })

  server.route({

    method: 'GET',

    path: '/api/vending/account/transactions',

    options: {

      auth : "token",

      handler: VendingMachineTransactions.getAccountTransactions,

      tags: ['api'],

      description: 'Returns vending transactions for an account'

    }

  })

  server.route({

    method: 'PUT',

    path: '/api/vending/vending-machines/{id}',

    config: {

      auth: 'sudopassword',

      handler: vendingMachines.update,

      description: 'Updates vending machine owner by anypay account email',

      tags: ['api'],

      validate: {

        payload: {

           email: Joi.string().optional(),

           current_location_address: Joi.string().optional(),

           current_location_name: Joi.string().optional(),

         }

      }

    }

  });

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

