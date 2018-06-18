"use strict";
require('dotenv').config();
const Hapi = require("hapi");
const AccessToken = require("../../lib/models/access_token");
const Account = require("../../lib/models/account");
const Invoice = require("../../lib/models/invoice");
const HapiSwagger = require("hapi-swagger");

const AccountsController = require("./handlers/accounts");
const PasswordsController = require("./handlers/passwords");
const AccessTokensController = require("./handlers/access_tokens");
const ExtendedPublicKeysController = require("./handlers/extended_public_keys");
const PairTokensController = require("./handlers/pair_tokens");
const ZcashInvoicesController = require("./handlers/zcash_invoices");
const DashInvoicesController = require("./handlers/dash_invoices");
const BitcoinCashInvoicesController = require("./handlers/bitcoin_cash_invoices");
const BitcoinInvoicesController = require("./handlers/bitcoin_invoices");
import * as BitcoinLightningInvoicesController from "./handlers/bitcoin_lightning_invoices.ts";
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

import * as monthlyChartsController from './handlers/monthly_totals';
import * as accountMonthlyChartsController from './handlers/account_monthly_totals';

const Fixer = require('../../lib/fixer');

import {events} from '../../lib/core';
import {notify} from '../../lib/slack/notifier';

events.on('address:set', async (changeset) => {

  await notify(`address:set:${JSON.stringify(changeset)}`);

});

WebhookHandler.on("webhook", payload => {
  console.log("payload", payload);
});

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
  })
  var account = await Account.findOne({
    where: {
      id: accessToken.account_id
    }
  })
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
      }
    }
  })

  server.auth.strategy("token", "basic", { validate: validateToken });
  server.auth.strategy("password", "basic", { validate: validatePassword });
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
      plugins: responsesWithSuccess({ model: Invoice.Resposne })
    },
  });
  server.route({
    method: "GET",
    path: "/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        headers: kBasicAuthorizationAllowOtherHeaders,
      },
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
      validate: {
        headers: kBasicAuthorizationAllowOtherHeaders,
      },
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
      validate: {
        headers: kBasicAuthorizationAllowOtherHeaders,
      },
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
        headers: kBasicAuthorizationAllowOtherHeaders,
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
        headers: kBasicAuthorizationAllowOtherHeaders,
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
        headers: kBasicAuthorizationAllowOtherHeaders,
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
        headers: kBasicAuthorizationAllowOtherHeaders,
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
        headers: kBasicAuthorizationAllowOtherHeaders,
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
        headers: kBasicAuthorizationAllowOtherHeaders,
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
      validate: {
        headers: kBasicAuthorizationAllowOtherHeaders
      },
      handler: AccessTokensController.create
    }
  });
  server.route({
    method: "GET",
    path: "/addresses",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        headers: kBasicAuthorizationAllowOtherHeaders,
      },
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
        headers: kBasicAuthorizationAllowOtherHeaders,
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
      validate: {
        headers: kBasicAuthorizationAllowOtherHeaders
      },
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
      validate: {
        headers: kBasicAuthorizationAllowOtherHeaders
      },
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
        headers: kBasicAuthorizationAllowOtherHeaders,
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
      validate: {
        headers: kBasicAuthorizationAllowOtherHeaders
      },
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
        headers: kBasicAuthorizationAllowOtherHeaders,
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
      validate: {
        headers: kBasicAuthorizationAllowOtherHeaders,
      },
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
