"use strict";
require('dotenv').config();
const logger = require('winston');
const Hapi = require("hapi");
const Invoice = require("../../lib/models/invoice");
const AccessToken = require("../../lib/models/access_token");
const Account = require("../../lib/models/account");
const PairToken = require("../../lib/models/pair_token");
const DashPayout = require("../../lib/models/dash_payout");
const HapiSwagger = require("hapi-swagger");
const Pack = require('../../package');

const AccountsController = require("./handlers/accounts");
const PasswordsController = require("./handlers/passwords");
const AccessTokensController = require("./handlers/access_tokens");
const BalancesController = require("./handlers/balances");
const ExtendedPublicKeysController = require("./handlers/extended_public_keys");
const PairTokensController = require("./handlers/pair_tokens");
const ZcashInvoicesController = require("./handlers/zcash_invoices");
const DashInvoicesController = require("./handlers/dash_invoices");
const BitcoinCashInvoicesController = require("./handlers/bitcoin_cash_invoices");
const BitcoinInvoicesController = require("./handlers/bitcoin_invoices");
const LitecoinInvoicesController = require("./handlers/litecoin_invoices");
const DogecoinInvoicesController = require("./handlers/dogecoin_invoices");
const AddressesController = require("./handlers/addresses");
const CoinsController = require("./handlers/coins");
const AccountLogin = require("../../lib/account_login");
const sequelize = require("../../lib/database");
const EventEmitter = require("events").EventEmitter;
const DashCore = require("../../lib/dashcore");
const DashPayoutAddress = require("../../lib/dash/payout_address");
const Blockcypher = require("../../lib/blockcypher");
const DashInvoice = require("../../lib/dash_invoice");
const Basic = require("hapi-auth-basic");
const bcrypt = require("bcrypt");
const owasp = require("owasp-password-strength-test");
const InvoicesController = require("./handlers/invoices");
const DashBoardController = require("./handlers/dashboard");
const WebhookHandler = new EventEmitter();
const log = require("winston");
const Features = require("../../lib/features");
const Joi = require('joi');

WebhookHandler.on("webhook", payload => {
  console.log("payload", payload);
});

const server = new Hapi.Server({
  host: process.env.HOST || "localhost",
  port: process.env.PORT || 8000,
  routes: {
    cors: true
  }
});

const validatePassword = async function(request, username, password, h) {
  if (!username || !password) {
    return {
      isValid: false
    };
  }

  try {
    var accessToken = await AccountLogin.withEmailPassword(username, password);
  } catch(error) {
    return {
      isValid: false,
      error: error.message
    }
  }

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

async function Server() {

  await server.register(require('hapi-auth-basic'));
  await server.register(require('inert'));
  await server.register(require('vision'));
  const swaggerOptions = server.register({
    plugin: HapiSwagger,
    options: {
      info: {
        title: 'Anypay API Documentation',
        version: Pack.version,
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
      handler: InvoicesController.show
    }
  });
  server.route({
    method: "GET",
    path: "/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
      },
      handler: InvoicesController.index
    }
  });
  server.route({
    method: "GET",
    path: "/dashboard",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
      },
      handler: DashBoardController.index
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
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
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
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
        payload: {
          amount: Joi.number().required()
        }
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
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
        payload: {
          amount: Joi.number().required()
        }
      },
      handler: ZcashInvoicesController.create
    }
  });
  server.route({
    method: "POST",
    path: "/dash/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
        payload: {
          amount: Joi.number().required()
        }
      },
      handler: DashInvoicesController.create
    }
  });
  server.route({
    method: "POST",
    path: "/btc/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
        payload: {
          amount: Joi.number().required()
        }
      },
      handler: BitcoinInvoicesController.create
    }
  });
  server.route({
    method: "POST",
    path: "/ltc/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
        payload: {
          amount: Joi.number().required()
        }
      },
      handler: LitecoinInvoicesController.create
    }
  });
  server.route({
    method: "POST",
    path: "/doge/invoices",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
        payload: {
          amount: Joi.number().required()
        }
      },
      handler: DogecoinInvoicesController.create
    }
  });

  server.route({
    method: "POST",
    path: "/accounts",
    config: {
      tags: ['api'],
      validate: {
        payload: {
          email: Joi.string().email().required(),
          password: Joi.string().required()
        }
      },
      handler: AccountsController.create
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
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown()
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
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown()
      },
      handler: AddressesController.list
    }
  });
  server.route({
    method: "PUT",
    path: "/addresses/{currency}",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
        params: {
          currency: Joi.string().required()
        },
        payload: {
          address: Joi.string().required()
        }
      },
      handler: AddressesController.update
    }
  });
  server.route({
    method: "GET",
    path: "/account",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown()
      },
      handler: AccountsController.show
    }
  });
  server.route({
    method: "GET",
    path: "/extended_public_keys",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown()
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
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
        payload: {
          xpubkey: Joi.string().required()
        }
      },
      handler: ExtendedPublicKeysController.create
    }
  });
  server.route({
    method: "GET",
    path: "/coins",
    config: {
      tags: ['api'],
      auth: "token",
      validate: {
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown()
      },
      handler: CoinsController.list
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
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
        payload: {
          currency: Joi.string().required(),
          amount: Joi.number().positive().required()
        }
      }
    }
  });
  server.route({
    method: "POST",
    path: "/pair_tokens/{uid}",
    config: {
      tags: ['api'],
      validate: {
        headers: Joi.object({
          'authorization': Joi.string().regex(/^(Basic) \w+/g).required()
        }).unknown(),
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
        payload: {
          email: Joi.string().email().required()
        }
      }
    }
  });

  server.route({
    method: "POST",
    path: "/password-resets/{uid}",
    config: {
      tags: ['api'],
      handler: PasswordsController.claim,
      validate: {
        payload: {
          password: Joi.string().min(1).required()
        }
      }
    }
  });

  return;
}

if (require.main === module) {
  // main module, sync database & start server
  sequelize.sync().then(async () => {

    await Server();

    // Start the server
    await server.start();
    console.log("Server running at:", server.info.uri);
  });
} else {
  // module is required, export server
  module.exports = server;
}
