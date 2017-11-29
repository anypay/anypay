"use strict";

const Hapi = require("hapi");

const Invoice = require("../../lib/models/invoice");
const AccessToken = require("../../lib/models/access_token");
const Account = require("../../lib/models/account");
const PairToken = require("../../lib/models/pair_token");
const DashPayout = require("../../lib/models/dash_payout");

const BalancesController = require("./handlers/balances");
const ExtendedPublicKeysController = require("./handlers/extended_public_keys");
const PairTokensController = require("./handlers/pair_tokens");
const ZcashInvoicesController = require("./handlers/zcash_invoices");
const DashInvoicesController = require("./handlers/dash_invoices");
const BitcoinInvoicesController = require("./handlers/bitcoin_invoices");
const LitecoinInvoicesController = require("./handlers/litecoin_invoices");
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

const WebhookHandler = new EventEmitter();

const log = require('winston');
const Features = require('../../lib/features');

WebhookHandler.on("webhook", payload => {
  console.log("payload", payload);
});

const server = new Hapi.Server();
server.connection({
  host: process.env.HOST || "localhost",
  port: process.env.PORT || 8000,
  routes: {
    cors: true
  }
});

const validatePassword = function(request, username, password, callback) {
  if (!username || !password) {
    return callback(null, false);
  }

  AccountLogin.withEmailPassword(username, password)
    .then(accessToken => {
      return callback(null, true, { accessToken });
    })
    .catch(error => {
      return callback(error, false);
    });
};

const validateToken = function(request, username, password, callback) {
  if (!username) {
    return callback(null, false);
  }

  AccessToken.findOne({
    where: {
      uid: username
    }
  })
    .then(accessToken => {
      if (accessToken) {
        request.account_id = accessToken.account_id;
        return callback(null, true, { accessToken: accessToken });
      } else {
        return callback(null, false);
      }
    })
    .catch(callback);
};

server.register(Basic, err => {
  if (err) {
    throw err;
  }

  server.auth.strategy("token", "basic", { validateFunc: validateToken });
  server.auth.strategy("password", "basic", { validateFunc: validatePassword });

  server.route({
    method: "GET",
    path: "/invoices/{invoice_id}",
    handler: function(request, reply) {
      Invoice.findOne({
        where: {
          uid: request.params.invoice_id
        }
      })
        .then(invoice => {
          if (invoice) {
            reply(invoice);
          } else {
            reply().code(404);
          }
        })
        .catch(error => reply({ error }).code(500));
    }
  });

  server.route({
    method: "GET",
    path: "/invoices",
    config: {
      auth: "token",
      handler: InvoicesController.index
    }
  });

  server.route({
    method: "POST",
    path: "/pair_tokens",
    config: {
      auth: "token",
      handler: (request, reply) => {
        PairToken.create({
          account_id: request.account_id
        })
          .then(pairToken => {
            reply(pairToken);
          })
          .catch(error => {
            reply({ error: error }).code(500);
          });
      }
    }
  });

  server.route({
    method: "GET",
    path: "/pair_tokens",
    config: {
      auth: "token",
      handler: (request, reply) => {
        PairToken.findAll({
          where: {
            account_id: request.account_id
          }
        })
          .then(pairTokens => {
            reply({ pair_tokens: pairTokens });
          })
          .catch(error => {
            reply({ error: error }).code(500);
          });
      }
    }
  });

  server.route({
    method: "POST",
    path: "/invoices",
    config: {
      auth: "token",
      handler: DashInvoicesController.create
    }
  });

  if (Features.isEnabled('BITCOINCASH')) {
    log.info('Bitcoin Cash Enabled');

    const BitcoinCashInvoicesController = require("./handlers/bitcoin_cash_invoices");

    server.route({
      method: "POST",
      path: "/bitcoin_cash/invoices",
      config: {
        auth: "token",
        handler: BitcoinCashInvoicesController.create
      }
    });
  } else {
    log.info('Bitcoin Cash Disabled');
  }

  server.route({
    method: "POST",
    path: "/zcash/invoices",
    config: {
      auth: "token",
      handler: ZcashInvoicesController.create
    }
  });

  server.route({
    method: "POST",
    path: "/dash/invoices",
    config: {
      auth: "token",
      handler: DashInvoicesController.create
    }
  });

  server.route({
    method: "POST",
    path: "/bitcoin/invoices",
    config: {
      auth: "token",
      handler: BitcoinInvoicesController.create
    }
  });

  server.route({
    method: "POST",
    path: "/litecoin/invoices",
    config: {
      auth: "token",
      handler: LitecoinInvoicesController.create
    }
  });

  server.route({
    method: "POST",
    path: "/accounts",
    handler: (request, reply) => {
      bcrypt.hash(request.payload.password, 10, (error, hash) => {
        Account.create({
          email: request.payload.email,
          password_hash: hash
        })
          .then(account => {
            reply(account);
          })
          .catch(error => {
            reply({ error: error }).code(500);
          });
      });
    }
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
      handler: (request, reply) => {
        reply(request.auth.credentials.accessToken);
      }
    }
  });

  server.route({
    method: "GET",
    path: '/addresses',
    config: {
      auth: "token",
      handler: AddressesController.list
    }
  });

  server.route({
    method: "PUT",
    path: '/addresses/{currency}',
    config: {
      auth: "token",
      handler: AddressesController.update
    }
  });

  server.route({
    method: "POST",
    path: "/payout_address",
    config: {
      auth: "token",
      handler: (request, reply) => {
        let accountId = request.auth.credentials.accessToken.account_id;

        DashPayoutAddress.save(accountId, request.payload.address)
          .then(() => {
            reply({ success: true }).code(200);
          })
          .catch(error => {
            reply({ error: error.message }).code(500);
          });
      }
    }
  });

  server.route({
    method: "GET",
    path: "/account",
    config: {
      auth: "token",
      handler: (request, reply) => {
        let accountId = request.auth.credentials.accessToken.account_id;

        Account.findOne({ where: { id: accountId } })
          .then(reply)
          .catch(error => {
            reply({ error: error.message }).code(500);
          });
      }
    }
  });

  server.route({
    method: "GET",
    path: "/balances",
    config: {
      auth: "token",
      handler: BalancesController.index
    }
  });

  server.route({
    method: "GET",
    path: "/extended_public_keys",
    config: {
      auth: "token",
      handler: ExtendedPublicKeysController.index
    }
  });

  server.route({
    method: "POST",
    path: "/extended_public_keys",
    config: {
      auth: "token",
      handler: ExtendedPublicKeysController.create
    }
  });

  server.route({
    method: "GET",
    path: "/dash_payouts",
    config: {
      auth: "token",
      handler: (request, reply) => {
        let accountId = request.auth.credentials.accessToken.account_id;

        DashPayout.findAll({ where: { account_id: accountId } })
          .then(reply)
          .catch(error => {
            reply({ error: error.message }).code(500);
          });
      }
    }
  });

  server.route({
    method: "GET",
    path: "/coins",
    config: {
      auth: "token",
      handler: CoinsController.list
    }
  });

  server.route({
    method: "POST",
    path: "/pair_tokens/{uid}",
    config: {
      handler: PairTokensController.claim
    }
  });
});

if (require.main === module) {
  // main module, sync database & start server
  sequelize.sync().then(() => {
    // Start the server
    server.start(err => {
      if (err) {
        throw err;
      }
      console.log("Server running at:", server.info.uri);
    });
  });
} else {
  // module is required, export server
  module.exports = server;
}
