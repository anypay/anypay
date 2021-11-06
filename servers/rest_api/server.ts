"use strict";
require('dotenv').config();

//require('../../lib/apm')

import * as Hapi from "hapi";
const HapiSwagger = require("hapi-swagger");

import { attachMerchantMapRoutes } from '../map/server';

import { log } from '../../lib';

import { validateToken, validateAdminToken, validateAppToken } from '../auth/hapi_validate_token';

import { hash, bcryptCompare } from '../../lib/password';

import { accountCSVReports } from './handlers/csv_reports';

import { parseUnconfirmedTxEventToPayments } from '../../plugins/dash/lib/blockcypher';

import * as payreq from '../payment_requests/server'

/* Import all handlers from './handlers directory */
import { requireHandlersDirectory } from '../../lib/rabbi_hapi';
import { join } from 'path';
const handlers = requireHandlersDirectory(join(__dirname, './handlers'));
/* end handlers import */

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
  attachMerchantMapRoutes(server);

  server.route({
    method: "GET",
    path: "/api/accounts-by-email/{email}",
    handler: handlers.Anypaycity.show
  });

  server.route({
    method: "GET",
    path: "/api/replace_by_fee/{txid}",
    handler: handlers.Rbf.show
  });

  server.route({
    method: "GET",
    path: "/invoices/{invoice_id}",
    handler: handlers.Invoices.show,
    options: {
      tags: ['api'],
      validate: {
        params: {
          invoice_id: Joi.string().required()
        },
      },
      plugins: responsesWithSuccess({ model: models.Invoice.Response })
    }
  });

  server.route({
    method: "GET",
    path: "/woocommerce",
    handler: handlers.Woocommerce.index,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/invoices/{invoice_uid}/payment_options",
    handler: handlers.InvoicePaymentOptions.show,
    options: {
      tags: ['api']
    }
  });

  server.route({
    method: "POST",
    path: "/invoices/{uid}/share/email",
    handler: handlers.Invoices.shareEmail,
    options: {
      tags: ['api'],
      validate: {
        payload: {
          email: Joi.string().email().required()
        }
      },
    }
  });

  /* TODO: Update clients to use /products not /grab_and_go_items */
  server.route({
    method: "GET",
    path: "/grab_and_go_items",
    handler: handlers.Products.index,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/invoices",
    handler: handlers.Invoices.index,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "POST",
    path: "/accounts",
    handler: handlers.Accounts.create,
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
    handler: handlers.Accounts.showPublic,
    options: {
      tags: ['api'],
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    },
  });

  server.route({
    method: "PUT",
    path: "/anonymous-accounts",
    handler: handlers.Accounts.registerAnonymous,
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
    handler: handlers.Accounts.createAnonymous,
    options: {
      tags: ['api']
    },
  });

  server.route({
    method: "POST",
    path: "/access_tokens",
    handler: handlers.AccessTokens.create,
    options: {
      auth: "password",
      tags: ['api'],
      plugins: responsesWithSuccess({ model: models.AccessToken.Response })
    }
  });

  server.route({
    method: "GET",
    path: "/addresses",
    handler: handlers.Addresses.list,
    options: {
      auth: "token",
      tags: ['api'],
      plugins: responsesWithSuccess({ model: handlers.Addresses.PayoutAddresses }),
    }
  });

  server.route({
    method: "DELETE",
    path: "/addresses/{currency}",
    handler: handlers.Addresses.delete,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/account_addresses",
    handler: handlers.Addresses.index,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "PUT",
    path: "/addresses/{id}/notes",
    handler: handlers.AddressNotes.update,
    options: {
      auth: "token",
      tags: ['api'],
      validate: {
        params: {
          id: Joi.number().required()
        },
        payload: {
          note: Joi.string().required()
        }
      }
    }
  });

  server.route({
    method: "PUT",
    path: "/addresses/{currency}",
    handler: handlers.Addresses.update,
    options: {
      auth: "token",
      tags: ['api'],
      validate: {
        params: {
          currency: Joi.string().required()
        },
        payload: handlers.Addresses.PayoutAddressUpdate
      },
      plugins: responsesWithSuccess({ model: models.Account.Response })
    }
  });

  server.route({
    method: "PUT",
    path: "/discounts/{currency}",
    handler: handlers.Discounts.update,
    options: {
      auth: "token",
      tags: ['api'],
      validate: {
        params: {
          currency: Joi.string().required(),
        },
        payload: {
          percent: Joi.number().required()
        },
      }
    }
  });

  server.route({
    method: "GET",
    path: "/account",
    handler: handlers.Accounts.show,
    options: {
      auth: "token",
      tags: ['api'],
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    }
  });

  server.route({
    method: "PUT",
    path: "/account",
    handler: handlers.Accounts.update,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "POST",
    path: "/invoices/{invoice_uid}/notes",
    handler: handlers.InvoiceNotes.create,
    options: {
      validate: {
        payload: {
          note: Joi.string().required()
        }
      },
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/coins",
    handler: handlers.Coins.list,
    options: {
      tags: ['api'],
      auth: "token",
      plugins: responsesWithSuccess({ model: handlers.Coins.CoinsIndexResponse }),
    }
  });

  server.route({
    method: "POST",
    path: "/invoices",
    handler: handlers.Invoices.create,
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
    handler: handlers.Invoices.cancel,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "POST",
    path: "/accounts/{account_id}/invoices",
    handler: handlers.Invoices.createPublic,
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
    handler: handlers.Passwords.reset,
    options: {
      tags: ['api'],
      validate: {
        payload: handlers.Passwords.PasswordReset,
      },
      plugins: responsesWithSuccess({ model: handlers.Passwords.Success }),
    }
  });

  server.route({
    method: "POST",
    path: "/password-resets/{uid}",
    handler: handlers.Passwords.claim,
    options: {
      tags: ['api'],
      validate: {
        payload: handlers.Passwords.PasswordResetClaim,
      },
      plugins: responsesWithSuccess({ model: handlers.Passwords.Success }),
    }
  });

  server.route({
    method: "PUT",
    path: "/settings/denomination",
    handler: handlers.Denominations.update,
    options: {
      tags: ['api'],
      auth: "token"
    }
  });

  server.route({
    method: "GET",
    path: "/settings/denomination",
    handler: handlers.Denominations.show,
    options: {
      tags: ['api'],
      auth: "token"
    }
  });

  server.route({
    method: "GET",
    path: "/base_currencies",
    handler: handlers.BaseCurrencies.index,
    options: {
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/convert/{oldamount}-{oldcurrency}/to-{newcurrency}",
    handler: handlers.PriceConversions.show,
    options: {
      tags: ['api']
    }
  });

  /* PAYMENT PROTOCOLS */

    server.route({
      method: "POST",
      path: "/r",
      handler: handlers.PaymentRequests.create,
      options: {
        auth: "app"
      }
    })

  /* END PAYMENT PROTOCOLS */

  server.route({
    method: "GET",
    path: "/csv/r",
    options: {
      handler: handlers.CsvPaymentRequest.show,
      validate: {
        query: {
          csv_url:  Joi.string().required()
        }
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/moneybutton/webhooks',
    handler: handlers.MoneybuttonWebhooks.create
  });

  server.route({
    method: 'GET',
    path: '/merchants',
    handler: handlers.Merchants.listActiveSince
  });

  server.route({
    method: 'GET',
    path: '/active-merchants',
    handler: handlers.Merchants.listActiveSince
  });

  server.route({
    method: 'GET',
    path: '/active-merchant-coins',
    handler: handlers.Merchants.listMerchantCoins
  });

  server.route({
    method: "GET",
    path: "/apps",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.Apps.index
    }
  });

  server.route({
    method: "GET",
    path: "/apps/{id}",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.Apps.show
    }
  });

  server.route({
    method: "POST",
    path: "/apps",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.Apps.create
    }
  });

  server.route({
    method: "POST",
    path: "/firebase_token",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.FirebaseTokens.create
    }
  });

  server.route({
    method: "PUT",
    path: "/firebase_token",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.FirebaseTokens.update
    }
  });

  server.route({
    method: 'GET',
    path: '/leaderboard',
    handler: handlers.Leaderboard.index
  }); 

  server.route({
    method: 'GET',
    path: '/support/{token}',
    handler: handlers.SupportProxy.show
  }); 

  server.route({
    method: 'GET',
    path: '/api_keys',
    handler: handlers.ApiKeys.index,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'POST',
    path: '/bittrex_api_keys',
    handler: handlers.BittrexApiKeys.create,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'GET',
    path: '/bittrex_api_keys',
    handler: handlers.BittrexApiKeys.show,
    options: {
      auth: "token"
    }
  }); 

  server.route({
    method: 'DELETE',
    path: '/bittrex_api_keys',
    handler: handlers.BittrexApiKeys.destroy,
    options: {
      auth: "token"
    }
  }); 


  server.route({
    method: 'GET',
    path: '/search/accounts',
    handler: handlers.Search.accounts
  }); 

  server.route({
    method: 'GET',
    path: '/search/accounts/near/{latitude}/{longitude}',
    handler: handlers.Accounts.nearby
  }); 

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

