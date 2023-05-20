
require('dotenv').config();

import * as Hapi from "@hapi/hapi";

const Inert = require('@hapi/inert');

const Vision = require('@hapi/vision');

const HapiSwagger = require("hapi-swagger");

import { config } from '../../lib/config'

import { HealthPlugin } from 'hapi-k8s-health'

import { attachV1Routes } from '../v1/routes';

import { attachRoutes as attachJsonV2 } from '../jsonV2/routes';

import { join } from 'path'

const Pack = require('../../package.json')

const AuthBearer = require('hapi-auth-bearer-token');

import { log } from '../../lib/log';

import { getHistogram } from '../../lib/prometheus'

import { requireDirectory } from 'rabbi'

const auth = requireDirectory('../auth')

import { accountCSVReports } from './handlers/csv_reports';

import * as payreq from '../payment_requests/server'

import { v0, failAction } from '../handlers'

import * as Joi from 'joi';

import { models } from '../../lib'

import { register as merchant_app } from './plugins/merchant_app'

import { schema } from 'anypay'

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

const server = new Hapi.Server({
  host: process.env.HOST || "0.0.0.0",
  port: process.env.PORT || 8000,
  //debug: { 'request': ['error', 'uncaught'] },
  routes: {
    cors: true,
    validate: {
      options: {
        stripUnknown: true
      }
    },
    files: {
        relativeTo: join(__dirname, '../../docs')
    }
  }
});

import { useJWT } from '../auth/jwt'

async function Server() {

  server.ext('onRequest', (request, h) => {

    request.startTimer = function({ method, path }) {

      try {

        const histogram = getHistogram({ method, path })

        request.endTimer = histogram.startTimer();

      } catch(error) {

        log.debug('prometheus.histogram.error', error)

      }

    }

    return h.continue;

  })

  server.ext('onPreResponse', (request, h) => {

    try {

      if (request.endTimer) {

        request.endTimer()

      }

    } catch(error) {

      console.error(error)

    }

    return h.continue;
  })

  // Transform non-boom errors into boom ones
  server.ext('onPreResponse', (request, h) => {
    // Transform only server errors 
    if (request.response.isBoom) {

      log.error('hapi.error.response', request.response)

      const statusCode = request.response.output.statusCode || 500

      log.error('hapi.error.response', request.response)

      if (statusCode === 500) {

        const response = {
          statusCode,
          error: request.response.error || request.response.message,
          message: request.response.message
        }
  
        return h.response(response).code(statusCode)

      } else {
    
        return h.response(request.response.output).code(statusCode)

      }

    } else {
      // Otherwise just continue with previous response
      return h.continue

    }
  })

  await server.register(require('@hapi/basic'));

  await server.register(Inert);

  await server.register(Vision);

  await server.register(require('hapi-boom-decorators'))

  await server.register({
    plugin: HapiSwagger,
    options: {
      info: {
        title: 'Anypay API Reference',
        version: Pack.version,
      },
      grouping: 'tags',
      tags: [
        {
          name: 'platform',
          description: 'Base Payments Platform'
        },
        /*
        {
          name: 'v1',
          description: 'Version 1 (Current)'
        },
        {
          name: 'wordpress',
          description: 'Woocommerce Wordpress App'
        },
        {
          name: 'v0',
          description: 'Version 0'
        }
        */
      ],
      securityDefinitions: {
        simple: {
          type: 'basic',
        },
      },
      host: 'api.anypayx.com',
      schemes: ['https'],
      documentationPath: '/api',
      security: [{
        simple: [],
      }],
    }
  })

  server.auth.strategy("token", "basic", { validate: auth.Token.validateToken });

  server.auth.strategy("app", "basic", { validate: auth.Token.validateAppToken });

  server.auth.strategy("password", "basic", { validate: auth.Password.validate });

  server.auth.strategy("prometheus", "basic", { validate: auth.Prometheus.auth });

  await server.register(AuthBearer)

  server.auth.strategy("jwt", "bearer-access-token", useJWT());

  await server.register({
    plugin: HealthPlugin,
    options: {
      auth: 'prometheus'
    }
  })

  payreq.attach(server)

  attachJsonV2(server)
  
  await merchant_app(server)

  // BEGIN PUBLIC ROUTES

  if (config.get('wallet_bot_app_enabled')) {

    log.debug('apps.wallet-bot.enabled')

    await server.register(require('../../apps/wallet-bot/plugin'))

    log.debug('apps.wallet-bot.plugin.registered')

  }

  server.route({
    method: "GET",
    path: "/throws",
    handler: () => {
      throw new Error('big bad wolf')
    }
  });

  server.route({
    method: "GET",
    path: "/bad-request",
    handler: (req, h) => {
      return h.badRequest('unexpected hurricane')
    }
  });

  server.route({
    method: "GET",
    path: "/base_currencies",
    handler: v0.BaseCurrencies.index,
    options: {
      tags: ['v0']
    }
  });

  server.route({
    method: "GET",
    path: "/convert/{oldamount}-{oldcurrency}/to-{newcurrency}",
    handler: v0.PriceConversions.show,
    options: {
      tags: ['v0']
    }
  });

  server.route({
    method: "POST",
    path: "/r",
    handler: v0.PaymentRequests.create,
    options: {
      auth: "app",
      tags: ['api', 'v0'],
      validate: {
        payload: Joi.object({
          template: schema.PaymentRequestTemplate.required(),
          options: Joi.object({
            webhook: Joi.string().optional(),
            redirect: Joi.string().optional(),
            secret: Joi.string().optional(),
            metadata: Joi.object().optional()
          }).optional()
        })
      }
    }
  })

  server.route({
    method: "DELETE",
    path: "/r/{uid}",
    handler: v0.PaymentRequests.cancel,
    options: {
      auth: "app",
      tags: ['api', 'v0', 'platform'],
    }
  })

  server.route({
    method: "POST",
    path: "/payment-requests",
    handler: v0.PaymentRequests.create,
    options: {
      auth: "app",
      tags: ['api', 'platform'],
      validate: {
        payload: Joi.object({
          template: schema.PaymentRequestTemplate.required(),
          options: Joi.object({
            webhook: Joi.string().optional(),
            redirect: Joi.string().optional(),
            secret: Joi.string().optional(),
            metadata: Joi.object().optional()
          }).optional()
        })
      }
    }
  })


  server.route({
    method: 'GET',
    path: '/merchants/{account_id}',
    handler: v0.Merchants.show,
    options: {
      tags: ['v0']
    }
  });

  server.route({
    method: "GET",
    path: "/api/accounts-by-email/{email}",
    handler: v0.Anypaycity.show,
    options: {
      tags: ['v0']
    }
  });

  server.route({
    method: "GET",
    path: "/invoices/{invoice_id}",
    handler: v0.Invoices.showDeprecated,
    options: {
      tags: ['api', 'v0'],
      validate: {
        params: Joi.object({
          invoice_id: Joi.string().required()
        }),
        failAction
      },
      plugins: responsesWithSuccess({ model: models.Invoice.Response })
    }
  });



  server.route({
    method: "GET",
    path: "/api/v1/invoices/{invoice_id}",
    handler: v0.Invoices.show,
    options: {
      tags: ['api', 'v0'],
      validate: {
        params: Joi.object({
          invoice_id: Joi.string().required()
        }),
        failAction
      },
      response: {
        failAction: 'log',
        schema: Joi.object({
          invoice: Joi.object({
            uid: Joi.string().required(),
            uri: Joi.string().required(),
            status: Joi.string().required(),
            currency: Joi.string().required(),
            amount: Joi.number().required(),
            hash: Joi.string().optional(),
            payment_options: Joi.array().items(Joi.object({
              time: Joi.string().required(),
              expires: Joi.string().required(),
              memo: Joi.string().optional(),
              paymentUrl: Joi.string().required(),
              paymentId: Joi.string().required(),
              chain: Joi.string().required(),
              currency: Joi.string().required(),
              network: Joi.string().required(),
              instructions: Joi.array().items(Joi.object({
                type: Joi.string().optional(),
                requiredFeeRate: Joi.number().optional(),
                outputs: Joi.array().items(Joi.object({
                  address: Joi.string(),
                  script: Joi.string(),
                  amount: Joi.number().required() 
                }).or('address', 'script').required()),
              })).required(),
            })).required(),
            notes: Joi.array().optional()
          }).required()
        }).required()
      },
    }
  });

  server.route({
    method: "GET",
    path: "/accounts/{id}", // id or email
    handler: v0.Accounts.showPublic,
    options: {
      tags: ['v0', 'accounts'],
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    },
  });

  server.route({
    method: "POST",
    path: "/accounts/{account_id}/invoices",
    handler: v0.Invoices.createPublic,
    options: {
      tags: ['v0', 'invoices'],
      validate: {
        payload: models.Invoice.Request,
        failAction
      },
      plugins: responsesWithSuccess({ model: models.Invoice.Response })
    }
  });


  // END PUBLIC ROUTES

  server.route({
    method: "GET",
    path: "/apps",
    options: {
      auth: "token",
      tags: ['v0'],
      handler: v0.Apps.index
    }
  });

  server.route({
    method: "GET",
    path: "/apps/{id}",
    options: {
      auth: "token",
      tags: ['v0'],
      handler: v0.Apps.show
    }
  });

  server.route({
    method: "POST",
    path: "/apps",
    options: {
      auth: "token",
      tags: ['v0'],
      handler: v0.Apps.create
    }
  });

  server.route({
    method: 'GET',
    path: '/search/accounts/near/{latitude}/{longitude}',
    handler: v0.Accounts.nearby,
    options: {
      tags: ['v0']
    }
  }); 

  await attachV1Routes(server)

  accountCSVReports(server);

  server.route({
    method: 'GET',
    path: '/',
    handler: (req, h) => {
      return h.redirect('/api')
    }
  }); 

  server.route({
    method: 'GET',
    path: '/_metrics',
    handler: v0.Prometheus.show,
    options: {
      auth: "prometheus"
    }
});

  return server;

}

if (require.main === module) {

  start();
}

async function start () {

  await Server();

  // Start the server
  await server.start();

  log.info(`Server running at: ${server.info.uri}`);

}

export { Server, start, server }

