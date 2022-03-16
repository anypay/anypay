"use strict";
require('dotenv').config();

import * as Hapi from "@hapi/hapi";

const HapiSwagger = require("hapi-swagger");

import { attachMerchantMapRoutes } from '../map/server';

import { attachV1Routes } from '../v1/routes';
import { attachRoutes as attachJsonV2 } from '../jsonV2/routes';

import { join } from 'path'

import { log } from '../../lib/log';

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


    log.error('auth.v0', error);

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
      },
      failAction: async (request, h, err) => {

        log.error('hapi.route.validation', err);

        if (err.isJoi) {
          log.error('hapi.route.validation', err);
        }

        throw err;
      }
    },
    files: {
        relativeTo: join(__dirname, '../../docs')
    }
  }
});

server.ext('onPreResponse', (request, h) => {

  if (request.response.isBoom) {

    log.error('request.error', request.response)

    return h.response({
      statusCode: 500,
      error: "Internal Server Error",
      message: request.response.message
    }).code(500)

  } else {

    return h.continue

  }


})


async function Server() {

  server.ext('onRequest', function(request, h) {

    log.debug('server.request', { id: request.info.id, headers: request.headers })

    if ('application/payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment';
    }

    if ('application/payment-request' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment-request';
    }

    if ('application/payment-verification' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment-verification';
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
  await server.register(require('@hapi/inert'));
  await server.register(require('@hapi/vision'));
  await server.register(require('hapi-boom-decorators'))

  const swaggerOptions = server.register({
    plugin: HapiSwagger,
    options: {
      schemes: ['https', 'http'],
      grouping: 'tags',
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
    handler: v0.Anypaycity.show,
    options: {
      description: "Redirect To Merchant Checkout Page With Its Email Address",
      tags: ['api', 'v0', 'checkout', 'app'],
      validate: {
        params: Joi.object({
          email: Joi.string().required()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            301: {
              description: 'Checkout Redirect'
            }
          }
        }
      }
    }
  });

  server.route({
    method: "GET",
    path: "/invoices/{invoice_id}",
    handler: v0.Invoices.show,
    options: {
      description: "Get Invoice Public Details",
      tags: ['api', 'v0', 'invoices'],
      validate: {
        params: Joi.object({
          invoice_id: Joi.string().required()
        })
      },
      response: {
        schema: Joi.object({
          invoice: v0.Invoices.Schema.Invoice,
          payment_options: Joi.array(),
          notes: Joi.array(),

          id: Joi.number().required(),
          uid: Joi.string().required(),
          account_id: Joi.number().required(),
          status: Joi.string().required(),
          createdAt: Joi.date().required(),
          updatedAt: Joi.date().required(),

          //denomination_amount: Joi.number().optional(),
          denomination_currency: Joi.string().optional(),
          currency: Joi.string().optional(),
          denomination: Joi.string().optional(),
          //amount: Joi.number().optional(),
          //denomination_amount_paid: Joi.number().optional(),

          email: Joi.string().optional(),
          external_id: Joi.string().optional(),
          business_id: Joi.string().optional(),
          location_id: Joi.string().optional(),
          register_id: Joi.string().optional(),
          cancelled: Joi.boolean().optional(),
          app_id: Joi.number().optional(),
          secret: Joi.string().optional(),
          item_uid: Joi.string().optional(),
          metadata: Joi.object().optional(),
          headers: Joi.object().optional(),
          tags: Joi.array().items(Joi.string()).optional(),
          is_public_request: Joi.boolean().optional(),
          currency_specified: Joi.boolean().optional(),
          replace_by_fee: Joi.boolean().optional(),
          expiry: Joi.date().optional(),
          complete: Joi.boolean().optional(),
          completed_at: Joi.date().optional(),
          redirect_url: Joi.string().optional(),
          webhook_url: Joi.string().optional(),
          invoice_currency: Joi.string().optional(),
          address: Joi.string().optional(),
          energycity_account_id: Joi.number().optional(),
          access_token: Joi.string().optional(),
          wordpress_site_url: Joi.string().optional(),
          hash: Joi.string().optional(),
          locked: Joi.boolean().optional(),
          uri: Joi.string().optional(),
          //invoice_amount: Joi.number().optional(),
          //invoice_amount_paid: Joi.number().optional(),
          settledAt: Joi.date().optional(),
          paidAt: Joi.date().optional(),
        })
        .unknown()
      },
      plugins: responsesWithSuccess({ model: models.Invoice.Response })
    }
  });

  server.route({
    method: "GET",
    path: "/woocommerce",
    handler: v0.Woocommerce.index, options: {
      description: "WooCommerce Checkout Settings",
      tags: ['api', 'v0', 'ecommerce', 'woocommerce'],
      auth: "token",
      //TODO: ADD RESPONSE SCHEMA
    }
  });

  server.route({
    method: "GET",
    path: "/invoices/{invoice_uid}/payment_options",
    handler: v0.InvoicePaymentOptions.show,
    options: {
      description: 'List Payment Options For Invoice',
      tags: ['api', 'v0', 'invoices']
      //TODO: ADD RESPONSE SCHEMA
    }
  });

  server.route({
    method: "POST",
    path: "/invoices/{uid}/share/email",
    handler: v0.Invoices.shareEmail,
    options: {
      description: 'Share Invoice Via Email',
      tags: ['api', 'v0', 'invoices'],
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required()
        })
      }
      //TODO: ADD RESPONSE SCHEMA
    }
  });


  server.route({
    method: "GET",
    path: "/grab_and_go_items",
    handler: v0.Products.index,
    options: {
      description: "List Your Products For Sale",
      auth: "token",
      tags: ['api', 'v0', 'products']
      //TODO: ADD RESPONSE SCHEMA
    }
  });

  server.route({
    method: "GET",
    path: "/invoices",
    handler: v0.Invoices.index,
    options: {
      description: "List Your Invoices",
      auth: "token",
      tags: ['api', 'v0', 'invoices'],
      response: {
        schema: Joi.object({
          invoices: Joi.array().items(v0.Invoices.Schema.Invoice)
        })
      }
    }
  });

  server.route({
    method: "POST",
    path: "/accounts",
    handler: v0.Accounts.create,
    options: {
      description: "Register a New Account",
      tags: ['api', 'v0', 'auth'],
      validate: {
        payload: models.Account.Credentials,
      },
      //TODO: ADD RESPONSE SCHEMA
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    },
  });
  server.route({
    method: "GET",
    path: "/accounts/{id}", // id or email
    handler: v0.Accounts.showPublic,
    options: {
      description: "Show Public Details of Account",
      tags: ['api', 'v0', 'map'],
      //TODO: ADD RESPONSE SCHEMA
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    },
  });

  server.route({
    method: "PUT",
    path: "/anonymous-accounts",
    handler: v0.Accounts.registerAnonymous,
    options: {
      description: "Register an Account Without Email",
      auth: "token",
      tags: ['api', 'v0', 'registration'],
      validate: {
        payload: models.Account.Credentials,
      },
      //TODO: ADD RESPONSE SCHEMA
      plugins: responsesWithSuccess({ model: models.Account.Response }),
    },
  });

  server.route({
    method: "POST",
    path: "/anonymous-accounts",
    handler: v0.Accounts.createAnonymous,
    options: {
      description: "Register an Account Without Email",
      tags: ['api', 'v0']
      //TODO: ADD RESPONSE SCHEMA
    },
  });

  server.route({
    method: "POST",
    path: "/access_tokens",
    handler: v0.AccessTokens.create,
    options: {
      description: "Grant Access Token With Account Login Credentials",
      auth: "password",
      tags: ['api', 'v0', 'auth'],
      response: {
        schema: Joi.object({
          
        })
      },
      //TODO: ADD RESPONSE SCHEMA
      plugins: responsesWithSuccess({ model: models.AccessToken.Response })
    }
  });

  server.route({
    method: "GET",
    path: "/addresses",
    handler: v0.Addresses.list,
    options: {
      description: "List Current Wallet Addresses",
      auth: "token",
      tags: ['api', 'v0', 'account', 'addresses'],
      response: {

      },
      //TODO: ADD RESPONSE SCHEMA
      plugins: responsesWithSuccess({ model: v0.Addresses.PayoutAddresses }),
    }
  });

  server.route({
    method: "DELETE",
    path: "/addresses/{currency}",
    handler: v0.Addresses.remove,
    options: {
      description: "Remove Wallet Address",
      auth: "token",
      tags: ['api', 'v0', 'account', 'addresses'],
      validate: {
        params: Joi.object({
          currency: Joi.string().required()
        })
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().required()
        })
      }
    }
  });

  server.route({
    method: "GET",
    path: "/account_addresses",
    handler: v0.Addresses.index,
    options: {
      description: "List Current Wallet Addresses",
      auth: "token",
      tags: ['api', 'v0', 'addresses'],
      response: {

        schema: Joi.object({
          addresses: Joi.array().items(v0.Addresses.schema.Address)
        })
      }
    }
  });


  server.route({
    method: "PUT",
    path: "/addresses/{id}/notes",
    handler: v0.AddressNotes.update,
    options: {
      description: "Include Note About Wallet Address",
      tags: ['api', 'v0', 'account', 'addresses'],
      auth: "token",
      validate: {
        params: Joi.object({
          id: Joi.number().required()
        }),
        payload: Joi.object({
          note: Joi.string().required()
        })
      },
      response: {
        schema: Joi.object({
          address: v0.Addresses.schema.Address
        })
      }
      //TODO: ADD RESPONSE SCHEMA
    }
  });

  server.route({
    method: "PUT",
    path: "/addresses/{currency}",
    handler: v0.Addresses.update,
    options: {
      description: "Update Wallet Address",
      auth: "token",
      tags: ['api', 'v0'],
      validate: {
        params: Joi.object({
          currency: Joi.string().required()
        }),
        payload: Joi.object({
          address: Joi.string().required()
        })
      }
      //TODO: ADD RESPONSE SCHEMA
    }
  });

  server.route({
    method: "PUT",
    path: "/discounts/{currency}",
    handler: v0.Discounts.update,
    options: {
      description: "Set A Discount For A Given Currency",
      auth: "token",
      tags: ['api', 'v0'],
      validate: {
        params: Joi.object({
          currency: Joi.string().required(),
        }),
        payload: Joi.object({
          percent: Joi.number().required()
        }),
      },
      response: {
        schema: Joi.object({
          discount: v0.Discounts.Schema.Discount
        })
      }
    }
  });

  server.route({
    method: "GET",
    path: "/account",
    handler: v0.Accounts.show,
    options: {
      description: "Account Profile",
      auth: "token",
      tags: ['api', 'v0'],
      plugins: responsesWithSuccess({ model: models.Account.Response }),
      //TODO: ADD RESPONSE SCHEMA
    }
  });


  server.route({
    method: "PUT",
    path: "/account",
    handler: v0.Accounts.update,
    options: {
      description: "Update Account Profile Settings",
      auth: "token",
      tags: ['api', 'v0']
      //TODO: ADD RESPONSE SCHEMA
    }
  });

  server.route({
    method: "POST",
    path: "/invoices/{invoice_uid}/notes",
    handler: v0.InvoiceNotes.create,
    options: {
      description: "Attach Note To Invoice",
      validate: {
        payload: Joi.object({
          note: Joi.string().required()
        })
      },
      //TODO: ADD RESPONSE SCHEMA
      auth: "token",
      tags: ['api', 'v0']
    }
  });

  server.route({
    method: "GET",
    path: "/coins",
    handler: v0.Coins.list,
    options: {
      description: "Get List of Coins Available",
      tags: ['api', 'v0'],
      auth: "token",
      //TODO: ADD RESPONSE SCHEMA
      plugins: responsesWithSuccess({ model: v0.Coins.CoinsIndexResponse }),
    }
  });


  server.route({
    method: "POST",
    path: "/invoices",
    handler: v0.Invoices.create,
    options: {
      description: "Create New Invoice",
      auth: "token",
      tags: ['api', 'v0'],
      validate: {
        payload: Joi.object({
          amount: Joi.number()
        }),
      },
      response: {
        //schema: v0.Invoices.Schema.Invoice,
        //failAction: 'log'
      },
      //plugins: responsesWithSuccess({ model: models.Invoice.Response }),
    }
  });


  server.route({
    method: "DELETE",
    path: "/invoices/{uid}",
    handler: v0.Invoices.cancel,
    options: {
      description: "Cancel An Invoice Before Payment",
      auth: "token",
      tags: ['api', 'v0']
      //TODO: ADD RESPONSE SCHEMA
    }
  });


  server.route({
    method: "POST",
    path: "/accounts/{account_id}/invoices",
    handler: v0.Invoices.createPublic,
    options: {
      description: "Payment Request To Pay Public Account",
      tags: ['api', 'v0', 'map', 'invoices'],
      validate: {
        payload: models.Invoice.Request,
      },
      //TODO: ADD RESPONSE SCHEMA
      plugins: responsesWithSuccess({ model: models.Invoice.Response })
    }
  });


  server.route({
    method: "POST",
    path: "/password-resets",
    handler: v0.Passwords.reset,
    options: {
      description: 'Request Password Reset Email Be Sent',
      tags: ['api', 'v0', 'auth'],
      validate: {
        payload: v0.Passwords.PasswordReset,
      },
      //TODO: ADD RESPONSE SCHEMA
      plugins: responsesWithSuccess({ model: v0.Passwords.Success }),
    }
  });


  server.route({
    method: "POST",
    path: "/password-resets/{uid}",
    handler: v0.Passwords.claim,
    options: {
      description: 'Reset Password With Claim Token',
      tags: ['api', 'v0'],
      validate: {
        payload: Joi.object({
          password: Joi.string().min(1).required(),
        }).label('PasswordResetClaim')
      },
      //TODO: ADD RESPONSE SCHEMA
      plugins: responsesWithSuccess({ model: v0.Passwords.Success }),
    }
  });

  server.route({
    method: "PUT",
    path: "/settings/denomination",
    handler: v0.Denominations.update,
    options: {
      description: 'Set Default Account Currency Denomination',
      tags: ['api', 'v0', 'account', 'settings'],
      //TODO: ADD RESPONSE SCHEMA
      auth: "token"
    }
  });


  server.route({
    method: "GET",
    path: "/settings/denomination",
    handler: v0.Denominations.show,
    options: {
      description: 'Get Account Currency Denomination Setting',
      tags: ['api', 'v0'],
      //TODO: ADD RESPONSE SCHEMA
      auth: "token"
    }
  });

  server.route({
    method: "GET",
    path: "/base_currencies",
    handler: v0.BaseCurrencies.index,
    options: {
      description: 'List All Base Currencies Available',
      tags: ['api', 'v0', 'app'],
      response: {
        schema: Joi.object({
          currencies: Joi.array().items(v0.BaseCurrencies.Schema.Currency).required()
        })
      }
    }
  });


  server.route({
    method: "GET",
    path: "/convert/{old_amount}-{old_currency}/to-{new_currency}",
    handler: v0.PriceConversions.show,
    options: {
      description: 'Calculate Exchange Price For Currency Pair',
      tags: ['api', 'v0'],
      validate: {
        params: Joi.object({
          old_amount: Joi.number().required(),
          old_currency: Joi.string().required(),
          new_currency: Joi.string().required(),
        })
      },
      response: {
        schema: Joi.object({ conversion: v0.PriceConversions.Schema.Conversion })
      }
    }
  });

    server.route({
      method: "POST",
      path: "/r",
      handler: v0.PaymentRequests.create,
      options: {
        description: 'Create New Arbitrary Payment Request',
        auth: "app",
        tags: ['api', 'v0']
        //TODO: ADD RESPONSE SCHEMA
      }
    })

    server.route({
      method: 'POST',
      path: '/moneybutton/webhooks',
      handler: v0.MoneybuttonWebhooks.create,
      options: {
        description: 'Handle Money Button Webhook Callback',
        //TODO: ADD PAYLOAD VALIDATION
        //TODO: ADD RESPONSE SCHEMA
        //TODO: EXCLUDE FROM DOCUMENTATION
      }

    });

  server.route({
    method: 'GET',
    path: '/merchants',
    handler: v0.Merchants.listActiveSince,
    options: {
      description: 'List Public Merchants'
      //TODO: ADD PAYLOAD VALIDATION
    }
  });

  server.route({
    method: 'GET',
    path: '/active-merchants',
    handler: v0.Merchants.listActiveSince,
    options: {
      description: 'List Active Merchants',
      tags: ['api', 'v0', 'map']
      //TODO: ADD PAYLOAD VALIDATION
    }
  });

  server.route({
    method: 'GET',
    path: '/active-merchant-coins',
    handler: v0.Merchants.listMerchantCoins,
    options: {
      description: 'List Active Merchant Coins',
      tags: ['api', 'v0', 'map']
      //TODO: ADD PAYLOAD VALIDATION
    }
  });

  server.route({
    method: "GET",
    path: "/apps",
    options: {
      description: 'List Your Apps',
      auth: "token",
      tags: ['api', 'v0', 'apps'],
      handler: v0.Apps.index,
      response: {
        schema: Joi.object({
          apps: Joi.array().items(Joi.object({
            id: Joi.number().required(),
            account_id: Joi.number().required(),
            name: Joi.string().required(),
            webhook_url: Joi.string().optional(),
            public_key: Joi.string().required(),
            private_key: Joi.string().required(),
            createdAt: Joi.date().required(),
            updatedAt: Joi.date().required()
          }))
        }),
        failAction: 'log'
      }
    }
  });

  server.route({
    method: "GET",
    path: "/apps/{id}",
    options: {
      description: 'Get App Details',
      auth: "token",
      tags: ['api', 'v0', 'apps'],
      handler: v0.Apps.show,
      validate: {
        params: Joi.object({
          id: Joi.number().required() 
        })
      },
      response: {
        schema: Joi.object({
          app: Joi.object({
            id: Joi.number().required(),
            account_id: Joi.number().required(),
            name: Joi.string().required(),
            webhook_url: Joi.string().optional(),
            public_key: Joi.string().required(),
            private_key: Joi.string().required(),
            createdAt: Joi.date().required(),
            updatedAt: Joi.date().required()
          }).required()
        }),
        failAction: 'log'
      }
    }
  });


  server.route({
    method: "POST",
    path: "/apps",
    options: {
      description: "Create A New App",
      auth: "token",
      tags: ['api', "v0"],
      handler: v0.Apps.create
      //TODO: ADD PAYLOAD VALIDATION
    }
  });

  server.route({
    method: "POST",
    path: "/firebase_token",
    options: {
      description: "Submit Firebase Token For Mobile Push Notifications",
      auth: "token",
      tags: ['app', 'v0', 'notifications'],
      handler: v0.FirebaseTokens.create,
      validate: {
        payload: Joi.object({
          firebase_token: Joi.string().required()
        })
      },
      response: {
        schema: Joi.object({
          firebase_token: Joi.object({
            id: Joi.number().required(),
            account_id: Joi.number().required(),
            token: Joi.string().required(),
            createdAt: Joi.date().required(),
            updatedAt: Joi.date().required()
          }).required()
        })
      }
    }
  });

  server.route({
    method: "PUT",
    path: "/firebase_token",
    options: {
      description: "Submit Firebase Token For Mobile Push Notifications",
      auth: "token",
      tags: ['app', 'v0', 'notifications'],
      handler: v0.FirebaseTokens.update,
      validate: {
        payload: Joi.object({
          firebase_token: Joi.string().required()
        })
      },
      response: {
        schema: Joi.object({
          firebase_token: Joi.object({
            id: Joi.number().required(),
            account_id: Joi.number().required(),
            token: Joi.string().required(),
            createdAt: Joi.date().required(),
            updatedAt: Joi.date().required()
          }).required()
        })
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/support/{token}',
    handler: v0.SupportProxy.show,
    options: {
      description: "Record User Navigation To Support Page",
      tags: ['app', 'v0']
    }
  }); 


  server.route({
    method: 'GET',
    path: '/api_keys',
    handler: v0.ApiKeys.index,
    options: {
      description: "List API Key Available For Account",
      tags: ['api', 'v0'],
      auth: "token"
    }
  }); 

  server.route({
    method: 'POST',
    path: '/bittrex_api_keys',
    handler: v0.BittrexApiKeys.create,
    options: {
      description: "Submit Bittrex Exchange API Keys",
      tags: ['api', 'v0', 'bittrex'],
      auth: "token"
    }
  }); 

  server.route({
    method: 'GET',
    path: '/bittrex_api_keys',
    handler: v0.BittrexApiKeys.show,
    options: {
      description: "List Bittrex Exchange API Keys",
      tags: ['api', 'v0', 'bittrex'],
      auth: "token"
    }
  }); 

  server.route({
    method: 'DELETE',
    path: '/bittrex_api_keys',
    handler: v0.BittrexApiKeys.destroy,
    options: {
      description: "Remove Bittrex Exchange API Keys",
      tags: ['api', 'v0', 'bittrex'],
      auth: "token"
    }
  }); 

  server.route({
    method: 'GET',
    path: '/search/accounts/near/{latitude}/{longitude}',
    handler: v0.Accounts.nearby,
    options: {
      description: "Find Businesses Nearby By Geo Coordinates",
      tags: ['api', 'v0', 'map']
    }
  }); 

  await attachV1Routes(server)

  accountCSVReports(server);

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

