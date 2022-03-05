"use strict";
require('dotenv').config();

import * as Hapi from "@hapi/hapi";

const HapiSwagger = require("hapi-swagger");

import { attachMerchantMapRoutes } from '../map/server';

import { attachV1Routes } from '../v1/routes';
import { attachRoutes as attachJsonV2 } from '../jsonV2/routes';

import { join } from 'path'

import { log } from '../../lib';

import { validateToken, validateAdminToken, validateAppToken } from '../auth/hapi_validate_token';

import { bcryptCompare } from '../../lib/password';

import { accountCSVReports } from './handlers/csv_reports';

import * as payreq from '../payment_requests/server'

import { v0 } from '../handlers'

const AccountLogin = require("../../lib/account_login");

const sequelize = require("../../lib/database");

const Joi = require('joi');

import { models } from '../../lib'

const validatePassword = async function(request, username, password, h) {

  try {


    /* 1) check for account by email (username)
       2) check for account password by hash compare
       3) check for sudo password by hash compare
       4) generate access token with expiration
    */

    if (!username || !password) {

      return {
        isValid: false
      };
    }

    var account = await models.Account.findOne({
      where: {
        email: username.toLowerCase()
      }
    });

    if (!account) {

      return {
        isValid: false
      }
    }


    var accessToken = await AccountLogin.withEmailPassword(username, password);

    if (accessToken) {

      return {
        isValid: true,
        credentials: { accessToken, account }
      };

    } else {


    }
  } catch(error) {


    log.error(error.message);

  }

  // check for sudo password
  try {

    await bcryptCompare(password, process.env.SUDO_PASSWORD_HASH);

  } catch(error) {

    return {
      isValid: false
    }

  }

  var isNew;
  [accessToken, isNew] = await models.AccessToken.findOrCreate({
    where: {
      account_id: account.id
    },
    defaults: {
      account_id: account.id
    }
  });

  return {
    isValid: true,
    credentials: { accessToken, account }
  }

};

const getAccount = async function(request, username, password, h) {

  var account = await models.Account.findOne({
    where: {
      id: request.params.account_id
    }
  });

  if (account) {

		request.account = account;
		request.is_public_request = true;

    return {
      isValid: true,
      credentials: { account: account }
    }
  } else {
    return {
      isValid: false
    }
  }
}

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

  server.ext('onRequest', function(request, h) {

    log.info('server.request', { id: request.info.id, headers: request.headers })

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

  server.ext('onRequest', function(request, h) {

    if ('application/payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment';
    }

    return h.continue;
  });

  await server.register(require('hapi-auth-basic'));
  await server.register(require('inert'));
  await server.register(require('vision'));
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

  server.auth.strategy("getaccount", "basic", { validate: getAccount });
  server.auth.strategy("token", "basic", { validate: validateToken });
  server.auth.strategy("app", "basic", { validate: validateAppToken });
  server.auth.strategy("password", "basic", { validate: validatePassword });
  server.auth.strategy("adminwebtoken", "basic", { validate: validateAdminToken });

  payreq.attach(server)

  attachJsonV2(server)

  attachMerchantMapRoutes(server);

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
        })
      },
      plugins: responsesWithSuccess({ model: models.Invoice.Response })
    }
  });

  server.route({
    method: "GET",
    path: "/woocommerce",
    handler: v0.Woocommerce.index,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/invoices/{invoice_uid}/payment_options",
    handler: v0.InvoicePaymentOptions.show,
    options: {
      tags: ['api']
    }
  });

  server.route({
    method: "POST",
    path: "/invoices/{uid}/share/email",
    handler: v0.Invoices.shareEmail,
    options: {
      tags: ['api'],
      validate: Joi.object({
        payload: {
          email: Joi.string().email().required()
        }
      })
    }
  });

  /* TODO: Update clients to use /products not /grab_and_go_items */
  server.route({
    method: "GET",
    path: "/grab_and_go_items",
    handler: v0.Products.index,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/invoices",
    handler: v0.Invoices.index,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "POST",
    path: "/accounts",
    handler: v0.Accounts.create,
    options: {
      tags: ['api'],
      validate: {
        payload: models.Account.Credentials,
      },
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    },
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
    method: "PUT",
    path: "/anonymous-accounts",
    handler: v0.Accounts.registerAnonymous,
    options: {
      auth: "token",
      tags: ['api'],
      validate: {
        payload: models.Account.Credentials,
      },
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    },
  });

  server.route({
    method: "POST",
    path: "/anonymous-accounts",
    handler: v0.Accounts.createAnonymous,
    options: {
      tags: ['api']
    },
  });

  server.route({
    method: "POST",
    path: "/access_tokens",
    handler: v0.AccessTokens.create,
    options: {
      auth: "password",
      tags: ['api'],
      plugins: responsesWithSuccess({ model: models.AccessToken.Response })
    }
  });

  server.route({
    method: "GET",
    path: "/addresses",
    handler: v0.Addresses.list,
    options: {
      auth: "token",
      tags: ['api'],
      plugins: responsesWithSuccess({ model: v0.Addresses.PayoutAddresses }),
    }
  });

  server.route({
    method: "DELETE",
    path: "/addresses/{currency}",
    handler: v0.Addresses.delete,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/account_addresses",
    handler: v0.Addresses.index,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "PUT",
    path: "/addresses/{id}/notes",
    handler: v0.AddressNotes.update,
    options: {
      auth: "token",
      tags: ['api'],
      validate: {
        params: Joi.object({
          id: Joi.number().required()
        }),
        payload: Joi.object({
          note: Joi.string().required()
        })
      }
    }
  });

  server.route({
    method: "PUT",
    path: "/addresses/{currency}",
    handler: v0.Addresses.update,
    options: {
      auth: "token",
      tags: ['api'],
      validate: {
        params: Joi.object({
          currency: Joi.string().required()
        }),
        payload: v0.Addresses.PayoutAddressUpdate
      },
      plugins: responsesWithSuccess({ model: models.Account.Response })
    }
  });

  server.route({
    method: "PUT",
    path: "/discounts/{currency}",
    handler: v0.Discounts.update,
    options: {
      auth: "token",
      tags: ['api'],
      validate: {
        params: Joi.object({
          currency: Joi.string().required(),
        }),
        payload: Joi.object({
          percent: Joi.number().required()
        }),
      }
    }
  });

  server.route({
    method: "GET",
    path: "/account",
    handler: v0.Accounts.show,
    options: {
      auth: "token",
      tags: ['api'],
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    }
  });

  server.route({
    method: "PUT",
    path: "/account",
    handler: v0.Accounts.update,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "POST",
    path: "/invoices/{invoice_uid}/notes",
    handler: v0.InvoiceNotes.create,
    options: {
      validate: {
        payload: Joi.object({
          note: Joi.string().required()
        })
      },
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/coins",
    handler: v0.Coins.list,
    options: {
      tags: ['api'],
      auth: "token",
      plugins: responsesWithSuccess({ model: v0.Coins.CoinsIndexResponse }),
    }
  });

  server.route({
    method: "POST",
    path: "/invoices",
    handler: v0.Invoices.create,
    options: {
      auth: "token",
      tags: ['api'],
      validate: {
        payload: models.Invoice.Request,
      },
      plugins: responsesWithSuccess({ model: models.Invoice.Response }),
    }
  });

  server.route({
    method: "DELETE",
    path: "/invoices/{uid}",
    handler: v0.Invoices.cancel,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "POST",
    path: "/accounts/{account_id}/invoices",
    handler: v0.Invoices.createPublic,
    options: {
      tags: ['api'],
      validate: {
        payload: models.Invoice.Request,
      },
      plugins: responsesWithSuccess({ model: models.Invoice.Response })
    }
  });

  server.route({
    method: "POST",
    path: "/password-resets",
    handler: v0.Passwords.reset,
    options: {
      tags: ['api'],
      validate: {
        payload: v0.Passwords.PasswordReset,
      },
      plugins: responsesWithSuccess({ model: v0.Passwords.Success }),
    }
  });

  server.route({
    method: "POST",
    path: "/password-resets/{uid}",
    handler: v0.Passwords.claim,
    options: {
      tags: ['api'],
      validate: {
        payload: v0.Passwords.PasswordResetClaim,
      },
      plugins: responsesWithSuccess({ model: v0.Passwords.Success }),
    }
  });

  server.route({
    method: "PUT",
    path: "/settings/denomination",
    handler: v0.Denominations.update,
    options: {
      tags: ['api'],
      auth: "token"
    }
  });

  server.route({
    method: "GET",
    path: "/settings/denomination",
    handler: v0.Denominations.show,
    options: {
      tags: ['api'],
      auth: "token"
    }
  });

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

  /* PAYMENT PROTOCOLS */

    server.route({
      method: "POST",
      path: "/r",
      handler: v0.PaymentRequests.create,
      options: {
        auth: "app"
      }
    })

  /* END PAYMENT PROTOCOLS */

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
    method: "POST",
    path: "/firebase_token",
    options: {
      auth: "token",
      tags: ['api'],
      handler: v0.FirebaseTokens.create
    }
  });

  server.route({
    method: "PUT",
    path: "/firebase_token",
    options: {
      auth: "token",
      tags: ['api'],
      handler: v0.FirebaseTokens.update
    }
  });

  server.route({
    method: 'GET',
    path: '/support/{token}',
    handler: v0.SupportProxy.show
  }); 

  server.route({
    method: 'GET',
    path: '/api_keys',
    handler: v0.ApiKeys.index,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'POST',
    path: '/bittrex_api_keys',
    handler: v0.BittrexApiKeys.create,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'GET',
    path: '/bittrex_api_keys',
    handler: v0.BittrexApiKeys.show,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'DELETE',
    path: '/bittrex_api_keys',
    handler: v0.BittrexApiKeys.destroy,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'GET',
    path: '/search/accounts/near/{latitude}/{longitude}',
    handler: v0.Accounts.nearby
  }); 
  await attachV1Routes(server)

  accountCSVReports(server);

  server.route({
    method: 'GET',
    path: '/',
    handler: (req, h) => {
      return h.redirect('https://anypay.dev')
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

  log.info(`Server running at: ${server.info.uri}`);

}

export { Server, start }

