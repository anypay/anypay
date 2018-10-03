"use strict";
require('dotenv').config();
import * as Hapi from "hapi";
const AccessToken = require("../../lib/models/access_token");
const Account = require("../../lib/models/account");
const Invoice = require("../../lib/models/invoice");
const HapiSwagger = require("hapi-swagger");

const AccountsController = require("./handlers/accounts");
const DenominationsController = require("./handlers/denominations");
const PasswordsController = require("./handlers/passwords");
const AccessTokensController = require("./handlers/access_tokens");
const ExtendedPublicKeysController = require("./handlers/extended_public_keys");
const PairTokensController = require("./handlers/pair_tokens");
const ZcashInvoicesController = require("./handlers/zcash_invoices");
const DashInvoicesController = require("./handlers/dash_invoices");
const BitcoinCashInvoicesController = require("./handlers/bitcoin_cash_invoices");
const BitcoinInvoicesController = require("./handlers/bitcoin_invoices");
const BitcoinLightningInvoicesController = require("./handlers/bitcoin_lightning_invoices");
const LitecoinInvoicesController = require("./handlers/litecoin_invoices");
const DogecoinInvoicesController = require("./handlers/dogecoin_invoices");
const AddressesController = require("./handlers/addresses");
const CoinsController = require("./handlers/coins");
const AccountLogin = require("../../lib/account_login");
const sequelize = require("../../lib/database");
const EventEmitter = require("events").EventEmitter;
const InvoicesController = require("./handlers/invoices");
const DashBoardController = require("./handlers/dashboard");
const WebhookHandler = new EventEmitter();
const Joi = require('joi');

import {createLinks} from './handlers/links_controller';
import {dashbackTotalsAlltime} from './handlers/dashback_controller';
import {dashbackTotalsByMonth} from './handlers/dashback_controller';

import * as monthlyChartsController from './handlers/monthly_totals';
import * as accountMonthlyChartsController from './handlers/account_monthly_totals';
import * as totals from './handlers/totals';

const Fixer = require('../../lib/fixer');

import {events} from '../../lib/core';
import {notify} from '../../lib/slack/notifier';

events.on('address:set', async (changeset) => {

  await notify(`address:set:${JSON.stringify(changeset)}`);

});

WebhookHandler.on("webhook", payload => {
  console.log("payload", payload);
});

import * as jwt from '../../lib/jwt';

const validateAdminToken = async function(request: Hapi.Request, username:string, password:string, h: Hapi.ResponseToolkit) {

  try {

    let token = await jwt.verifyToken(username);

    return {
      isValid: true,
      token
    }

  } catch(error) {

    return {
      isValid: false
    }

  }
}

const validatePassword = async function(request, username, password, h) {
  if (!username || !password) {
    return {
      isValid: false
    };
  }

  var accessToken = await AccountLogin.withEmailPassword(username, password);


  if (accessToken) {

    return {
      isValid: true,
      credentials: { accessToken }
    };

  } else {
    var account = await Account.findOne({
      where: {
        email: username
      }
    });
    console.log("ACCOUNT", account);

    if (!account) {

      return {
        isValid: false
      }
    }

    var accessToken = await AccessToken.findOne({
      where: {
        account_id: account.id,
        uid: password
      }
    })

    if (accessToken) {

      return {
        isValid: true,
        credentials: { accessToken }
      };

    } else {

      return {
        isValid: false
      }

    }

  }
};

const validateToken = async function(request, username, password, h) {
  if (!username) {
    return {
      isValid: false
    };
  }

  var accessToken = await AccessToken.findOne({
    where: {
      uid: username
    }
  });

  if (accessToken) {
		var account = await Account.findOne({
			where: {
				id: accessToken.account_id
			}
		})
		request.account = account;
    request.account_id = accessToken.account_id;

    return {
      isValid: true,
      credentials: { accessToken: accessToken }
    }
  } else {
    return {
      isValid: false
    }
  }
};

// Unused
const kBasicAuthorizationAllowOtherHeaders = Joi.object({
  authorization: Joi.string().regex(/^(Basic) \w+/g).required()
}).unknown()

const kBadRequestSchema = Joi.object({
  statusCode: Joi.number().integer().required(),
  error: Joi.string().required(),
  message: Joi.string().required(),
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
      }
    }
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

  server.auth.strategy("token", "basic", { validate: validateToken });
  server.auth.strategy("password", "basic", { validate: validatePassword });
  server.auth.strategy("adminwebtoken", "basic", { validate: validateAdminToken });
  server.route({
    method: "GET",
    path: "/invoices/{invoice_id}",
    config: {
      tags: ['api'],
      handler: InvoicesController.show,
      validate: {
        params: {
          invoice_id: Joi.string().required()
        },
      },
      plugins: responsesWithSuccess({ model: Invoice.Response })
    },
  });
  server.route({
    method: "GET",
    path: "/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      handler: InvoicesController.index,
      plugins: responsesWithSuccess({ model: DashBoardController.IndexResponse })
    }
  });
  server.route({
    method: "GET",
    path: "/dashboard",
    config: {
      auth: "token",
      tags: ['api'],
      handler: DashBoardController.index,
      plugins: responsesWithSuccess({ model: DashBoardController.IndexResponse })
    }
  });
  server.route({
    method: "POST",
    path: "/pair_tokens",
    config: {
      auth: "token",
      tags: ['api'],
      handler: PairTokensController.create
    }
  });
  server.route({
    method: "GET",
    path: "/pair_tokens",
    config: {
      auth: "token",
      tags: ['api'],
      handler: PairTokensController.show
    }
  });
  server.route({
    method: "POST",
    path: "/bch/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        payload: Invoice.Request,
      },
      handler: BitcoinCashInvoicesController.create
    }
  });

  server.route({
    method: "POST",
    path: "/zec/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        payload: Invoice.Request,
      },
      handler: ZcashInvoicesController.create,
      plugins: responsesWithSuccess({ model: Invoice.Response }),
    }
  });
  server.route({
    method: "POST",
    path: "/btc.lightning/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        headers: kBasicAuthorizationAllowOtherHeaders,
        payload: Invoice.Request,
      },
      handler: BitcoinLightningInvoicesController.create,
      plugins: responsesWithSuccess({ model: Invoice.Response }),
    }
  });
  server.route({
    method: "POST",
    path: "/dash/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        payload: Invoice.Request,
      },
      handler: DashInvoicesController.create,
      plugins: responsesWithSuccess({ model: Invoice.Response }),
    }
  });
  server.route({
    method: "POST",
    path: "/btc/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        payload: Invoice.Request,
      },
      handler: BitcoinInvoicesController.create,
      plugins: responsesWithSuccess({ model: Invoice.Response }),
    }
  });
  server.route({
    method: "POST",
    path: "/ltc/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        payload: Invoice.Request,
      },
      handler: LitecoinInvoicesController.create,
      plugins: responsesWithSuccess({ model: Invoice.Response }),
    }
  });
  server.route({
    method: "POST",
    path: "/doge/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        payload: Invoice.Request,
      },
      handler: DogecoinInvoicesController.create,
      plugins: responsesWithSuccess({ model: Invoice.Response }),
    }
  });

  server.route({
    method: "POST",
    path: "/accounts",
    config: {
      tags: ['api'],
      validate: {
        payload: Account.Credentials,
      },
      handler: AccountsController.create,
      plugins: responsesWithSuccess({ model: Account.Response }),
    },
  });

  server.route({
    method: "GET",
    path: "/accounts/:account_uid/confirmation",
    handler: (request, reply) => {
      // email confirmation link
    }
  });
  server.route({
    method: "POST",
    path: "/access_tokens",
    config: {
      auth: "password",
      tags: ['api'],
      handler: AccessTokensController.create,
      plugins: responsesWithSuccess({ model: AccessToken.Response })
    }
  });
  server.route({
    method: "GET",
    path: "/addresses",
    config: {
      auth: "token",
      tags: ['api'],
      handler: AddressesController.list,
      plugins: responsesWithSuccess({ model: AddressesController.PayoutAddresses }),
    }
  });
  server.route({
    method: "PUT",
    path: "/addresses/{currency}",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        params: {
          currency: Joi.string().required()
        },
        payload: AddressesController.PayoutAddressUpdate,
      },
      handler: AddressesController.update,
      plugins: responsesWithSuccess({ model: Account.Response })
    }
  });
  server.route({
    method: "GET",
    path: "/account",
    config: {
      auth: "token",
      tags: ['api'],
      handler: AccountsController.show,
      plugins: responsesWithSuccess({ model: Account.Response }),
    }
  });
  server.route({
    method: "GET",
    path: "/extended_public_keys",
    config: {
      auth: "token",
      tags: ['api'],
      handler: ExtendedPublicKeysController.index
    }
  });
  server.route({
    method: "POST",
    path: "/extended_public_keys",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        payload: ExtendedPublicKeysController.ExtendedPublicKey
      },
      handler: ExtendedPublicKeysController.create,
      plugins: responsesWithSuccess({ model: ExtendedPublicKeysController.ExtendedPublicKey }),
    }
  });
  server.route({
    method: "GET",
    path: "/coins",
    config: {
      tags: ['api'],
      auth: "token",
      handler: CoinsController.list,
      plugins: responsesWithSuccess({ model: CoinsController.CoinsIndexResponse }),
    }
  });
  server.route({
    method: "POST",
    path: "/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      handler: InvoicesController.create,
      validate: {
        payload: Invoice.Request,
      },
      plugins: responsesWithSuccess({ model: Invoice.Response }),
    }
  });
  server.route({
    method: "POST",
    path: "/pair_tokens/{uid}",
    config: {
      tags: ['api'],
      handler: PairTokensController.claim
    }
  });

  server.route({
    method: "POST",
    path: "/password-resets",
    config: {
      tags: ['api'],
      handler: PasswordsController.reset,
      validate: {
        payload: PasswordsController.PasswordReset,
      },
      plugins: responsesWithSuccess({ model: PasswordsController.Success }),
    }
  });

  server.route({
    method: "POST",
    path: "/password-resets/{uid}",
    config: {
      tags: ['api'],
      handler: PasswordsController.claim,
      validate: {
        payload: PasswordsController.PasswordResetClaim,
      },
      plugins: responsesWithSuccess({ model: PasswordsController.Success }),
    }
  });

  server.route({
    method: "PUT",
    path: "/settings/denomination",
    config: {
      tags: ['api'],
      auth: "token",
      handler: DenominationsController.update
    }
  });

  server.route({
    method: "GET",
    path: "/settings/denomination",
    config: {
      tags: ['api'],
      auth: "token",
      handler: DenominationsController.show
    }
  });

  server.route({
    method: "GET",
    path: "/base_currencies",
    config: {
      tags: ['api'],
      handler: async (request, h) => {

        var currencies = await Fixer.getCurrencies();

        return currencies;

      }
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/usd",
    config: {
      tags: ['api'],
      handler: monthlyChartsController.usd
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/btc",
    config: {
      tags: ['api'],
      handler: monthlyChartsController.btc
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/dash",
    config: {
      tags: ['api'],
      handler: monthlyChartsController.dash
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/transactions/{coin}",
    config: {
      tags: ['api'],
      handler: monthlyChartsController.totalTransactionsByCoin
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/bch",
    config: {
      tags: ['api'],
      handler: monthlyChartsController.bch
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/total",
    config: {
      tags: ['api'],
      handler: monthlyChartsController.total
    }
  });

  server.route({
    method: "GET",
    path: "/account/totals/monthly/{currency}",
    config: {
      auth: "token",
      tags: ['api'],
      handler: accountMonthlyChartsController.byCurrency
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/count",
    config: {
      tags: ['api'],
      handler: monthlyChartsController.count
    }
  });

  server.route({
    method: "POST",
    path: "/links",
    config: {
      tags: ['api'],
      handler: createLinks
    }
  });

  server.route({
    method: "GET",
    path: "/dashback/totals/alltime",
    config: {
      tags: ['api'],
      handler: dashbackTotalsAlltime
    }
  });

  server.route({
    method: "GET",
    path: "/dashback/totals/monthly",
    config: {
      tags: ['api'],
      handler: dashbackTotalsByMonth
    }
  });

  server.route({
    method: "GET",
    path: "/totals/merchants",
    config: {
      tags: ['api'],
      handler: totals.merchants
    }
  });
  
  server.route({
    method: "GET",
    path: "/sudo/tokenvalidations",
    config: {
      auth: "adminwebtoken",
      tags: ['api'],
      handler: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {

        return {
          token: req.auth.token
        };
      }
    }
  });

  return server;
}

if (require.main === module) {
  // main module, sync database & start server
  sequelize.sync().then(async () => {

    var server = await Server();

    // Start the server
    await server.start();
    console.log("Server running at:", server.info.uri);
  });
}

export { Server }
