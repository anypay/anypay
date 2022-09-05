
require('dotenv').config();

import * as Hapi from "@hapi/hapi";

const Inert = require('@hapi/inert');

const Vision = require('@hapi/vision');

const HapiSwagger = require("hapi-swagger");

import { config } from '../../lib/config'

import { HealthPlugin } from 'hapi-k8s-health'

import { register as registerWalletBotRoutes } from '../../plugins/wallet-bot'

import { attachV1Routes } from '../v1/routes';

import { attachRoutes as attachJsonV2 } from '../jsonV2/routes';

import { join } from 'path'

const AuthBearer = require('hapi-auth-bearer-token');

import { log } from '../../lib/log';

import { prometheus, getHistogram } from '../../lib/prometheus'

import { requireDirectory } from 'rabbi'

const auth = requireDirectory('../auth')

import { accountCSVReports } from './handlers/csv_reports';

import * as payreq from '../payment_requests/server'

import { v0, failAction } from '../handlers'

import * as Joi from '@hapi/joi';

import { models } from '../../lib'

import { register as merchant_app } from './plugins/merchant_app'

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
  host: process.env.HOST || "localhost",
  port: process.env.PORT || 8000,
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

  await server.register(require('@hapi/basic'));

  await server.register(Inert);

  await server.register(Vision);

  await server.register(require('hapi-boom-decorators'))

  const swaggerOptions = server.register({
    plugin: HapiSwagger,
    options: {
      info: {
        title: 'Anypay API Documentation',
        version: '1.0.1',
      },
      securityDefinitions: {
        simple: {
          type: 'basic',
        },
      },
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
    path: "/base_currencies",
    handler: v0.BaseCurrencies.index,
    options: {
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/convert/{oldamount}-{oldcurrency}/to-{newcurrency}",
    handler: v0.PriceConversions.show,
    options: {
      tags: ['api']
    }
  });

  server.route({
    method: "POST",
    path: "/r",
    handler: v0.PaymentRequests.create,
    options: {
      auth: "app"
    }
  })

  server.route({
    method: 'POST',
    path: '/moneybutton/webhooks',
    handler: v0.MoneybuttonWebhooks.create
  });

  server.route({
    method: 'GET',
    path: '/merchants',
    handler: v0.Merchants.listActiveSince
  });

  server.route({
    method: 'GET',
    path: '/merchants/{account_id}',
    handler: v0.Merchants.show
  });

  server.route({
    method: 'GET',
    path: '/active-merchants',
    handler: v0.Merchants.listActiveSince
  });

  server.route({
    method: 'GET',
    path: '/active-merchant-coins',
    handler: v0.Merchants.listMerchantCoins
  });

  server.route({
    method: "GET",
    path: "/api/accounts-by-email/{email}",
    handler: v0.Anypaycity.show
  });

  server.route({
    method: "GET",
    path: "/invoices/{invoice_id}",
    handler: v0.Invoices.show,
    options: {
      tags: ['api'],
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
    path: "/accounts/{id}", // id or email
    handler: v0.Accounts.showPublic,
    options: {
      tags: ['api'],
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    },
  });

  server.route({
    method: "POST",
    path: "/accounts/{account_id}/invoices",
    handler: v0.Invoices.createPublic,
    options: {
      tags: ['api'],
      validate: {
        payload: models.Invoice.Request,
        failAction
      },
      plugins: responsesWithSuccess({ model: models.Invoice.Response })
    }
  });

  server.route({
    method: "POST",
    path: "/anonymous-accounts",
    handler: v0.Accounts.createAnonymous,
    options: {
      tags: ['api']
    },
  });

  // END PUBLIC ROUTES

  server.route({
    method: "GET",
    path: "/apps",
    options: {
      auth: "token",
      tags: ['api'],
      handler: v0.Apps.index
    }
  });

  server.route({
    method: "GET",
    path: "/apps/{id}",
    options: {
      auth: "token",
      tags: ['api'],
      handler: v0.Apps.show
    }
  });

  server.route({
    method: "POST",
    path: "/apps",
    options: {
      auth: "token",
      tags: ['api'],
      handler: v0.Apps.create
    }
  });

  server.route({
    method: 'GET',
    path: '/search/accounts/near/{latitude}/{longitude}',
    handler: v0.Accounts.nearby
  }); 

  await attachV1Routes(server)

  await registerWalletBotRoutes(server)

  accountCSVReports(server);

  server.route({
    method: 'GET',
    path: '/',
    handler: (req, h) => {
      return h.redirect('/documentation')
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

