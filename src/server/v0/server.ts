import * as dotenv from 'dotenv'

dotenv.config()

const VERSION = '1.8.4'

//@ts-ignore
import * as Hapi from "@hapi/hapi";

import Inert from '@hapi/inert';

import Vision from '@hapi/vision';

import HapiSwagger from 'hapi-swagger'

import HapiBasic from '@hapi/basic'

//@ts-ignore
import HapiSentry from 'hapi-sentry'

//@ts-ignore
import HapiBoomDecorators from 'hapi-boom-decorators'

import { createPlugin as promsterPlugin } from '@promster/hapi';

import { config } from '@/lib/config'

import { HealthPlugin } from 'hapi-k8s-health'

import { attachV1Routes } from '@/server/v1/routes';

import { attachRoutes as attachJsonV2 } from '@/server/jsonV2/routes';

import * as AuthBearer from 'hapi-auth-bearer-token'

import { log } from '@/lib/log';

import { getHistogram } from '@/lib/prometheus'

import * as auth from '@/server/auth' 

import { accountCSVReports } from '@/server/v0/handlers/csv_reports';

import * as payreq from '@/server/payment_requests/server'

import { v0, failAction } from '@/server/handlers'

import * as Joi from 'joi';

import { register as merchant_app } from '@/server/v0/plugins/merchant_app'

import { schema } from 'anypay'

import { useJWT } from '@/server/auth/jwt'

async function NewServer(): Promise<Hapi.Server> {

  const port = config.get('PORT') || 8000

  console.log("PORT", port)

  const server = new Hapi.Server({
    host: config.get('HOST') || "0.0.0.0",
    port: config.get('PORT') || 8000,
    //debug: { 'request': ['error', 'uncaught'] },
    routes: {
      cors: true,
      validate: {
        options: {
          stripUnknown: true
        }
      },
      /*files: {
          relativeTo: join(__dirname, '../../docs')
      }*/
    }
  });

  console.log("SERVER CREATED")
  

  server.ext('onRequest', (request: any, h: any) => {

    request.startTimer = function({ method, path }: { method: string, path: string }) {

      try {

        const histogram = getHistogram({ method, path })

        request.endTimer = histogram.startTimer();

      } catch(error) {

        log.debug('prometheus.histogram.error', error)

      }

    }

    return h.continue;

  })

  server.ext('onPreResponse', (request: any, h: any) => {

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
  server.ext('onPreResponse', (request: any, h: any) => {
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

  console.log("SERVER REGISTERING BASIC")

  await server.register(HapiBasic);

  console.log("SERVER REGISTERING INERT")

  await server.register(Inert);

  console.log("SERVER REGISTERING VISION")

  await server.register(Vision);

  console.log("SERVER REGISTERING BOOM DECORATORS")

  await server.register(HapiBoomDecorators)

  console.log("SERVER REGISTERING PROMSTER")

  await server.register(promsterPlugin())

  console.log("SERVER REGISTERING SENTRY")

  if (config.get('SENTRY_DSN')) {

    await server.register({
      plugin: HapiSentry,
      options: {
        client: { dsn: config.get('SENTRY_DSN') },
      },
    });

  }

  await server.register({
    plugin: HapiSwagger,
    options: {
      info: {
        title: 'Anypay API Reference',
        version: VERSION,
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
      host: 'anypayx.com',
      schemes: ['https'],
      documentationPath: '/api',
      security: [{
        simple: [],
      }],
    }
  })

  console.log("SERVER REGISTERING AUTH BEARER")

  server.auth.strategy("token", "basic", { validate: auth.Token.validateToken });

  server.auth.strategy("app", "basic", { validate: auth.Token.validateAppToken });

  server.auth.strategy("password", "basic", { validate: auth.Password.validate });

  server.auth.strategy("prometheus", "basic", { validate: auth.Prometheus.auth });

  await server.register(AuthBearer)

  console.log("SERVER REGISTERING JWT")

  server.auth.strategy("jwt", "bearer-access-token", useJWT());

  console.log("SERVER REGISTERING HEALTH PLUGIN")

  await server.register({
    plugin: HealthPlugin,
    options: {
      auth: 'prometheus'
    }
  })

  console.log("SERVER REGISTERING PAYREQ")

  payreq.attach(server)

  console.log("SERVER REGISTERING JSON V2")

  attachJsonV2(server)
  
  console.log("SERVER REGISTERING MERCHANT APP")

  await merchant_app(server)

  // BEGIN PUBLIC ROUTES

  console.log("SERVER REGISTERING WALLET BOT APP")

  if (config.get('WALLET_BOT_APP_ENABLED')) {

    log.debug('apps.wallet-bot.enabled')

    await server.register(require('@/apps/wallet-bot/plugin'))

    log.debug('apps.wallet-bot.plugin.registered')

  }

  server.route({
    method: "GET",
    path: "/base_currencies",
    handler: v0.BaseCurrencies.index,
    options: {
      tags: []
    }
  });

  server.route({
    method: "GET",
    path: "/convert/{oldamount}-{oldcurrency}/to-{newcurrency}",
    handler: v0.PriceConversions.show,
    options: {
      tags: []
    }
  });

  server.route({
    method: "POST",
    path: "/r",
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
    method: "DELETE",
    path: "/r/{uid}",
    handler: v0.PaymentRequests.cancel,
    options: {
      auth: "app",
      tags: ['api', 'platform'],
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
        }).label('CreatePaymentRequest')
      }
    }
  })


  server.route({
    method: 'GET',
    path: '/merchants/{account_id}',
    handler: v0.Merchants.show,
    options: {
      tags: []
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
    }
  });

  server.route({
    method: "GET",
    path: "/api/v1/invoices/{invoice_id}",
    handler: v0.Invoices.show,
    options: {
      tags: ['api', 'invoices'],
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
          }).required().label('Invoice')
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
    },
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

  await attachV1Routes(server)

  accountCSVReports(server);

  server.route({
    method: 'GET',
    path: '/',
    handler: (req: any, h: any) => {
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

var server: Hapi.Server;

async function start () {

  server = await NewServer();

  // Start the server
  await server.start();

  log.info(`Server running at: ${server.info.uri}`);

}

export { NewServer, start, server }

