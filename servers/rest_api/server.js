"use strict";
const logger = require('winston');
const Hapi = require("hapi");
const Invoice = require("../../lib/models/invoice");
const AccessToken = require("../../lib/models/access_token");
const Account = require("../../lib/models/account");
const PairToken = require("../../lib/models/pair_token");
const DashPayout = require("../../lib/models/dash_payout");

const AccountsController = require("./handlers/accounts");
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

console.log("IN THE FILE");

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

  var accessToken = await AccountLogin.withEmailPassword(username, password);

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
  if (accessToken) {
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

  server.auth.strategy("token", "basic", { validate: validateToken });
  server.auth.strategy("password", "basic", { validate: validatePassword });
  server.route({
    method: "GET",
    path: "/invoices/{invoice_id}",
    handler: InvoicesController.show
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
    method: "GET",
    path: "/dashboard",
    config: {
      auth: "token",
      handler: DashBoardController.index
    }
  });
  server.route({
    method: "POST",
    path: "/pair_tokens",
    config: {
      auth: "token",
      handler: PairTokensController.create
    }
  });
  server.route({
    method: "GET",
    path: "/pair_tokens",
    config: {
      auth: "token",
      handler: PairTokensController.show
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
  server.route({
    method: "POST",
    path: "/bitcoin_cash/invoices",
    config: {
      auth: "token",
      handler: BitcoinCashInvoicesController.create
    }
  });

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
    path: "/dogecoin/invoices",
    config: {
      auth: "token",
      handler: DogecoinInvoicesController.create
    }
  });

  server.route({
    method: "POST",
    path: "/accounts",
    handler: AccountsController.create
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
      handler: AccessTokensController.create
    }
  });
  server.route({
    method: "GET",
    path: "/addresses",
    config: {
      auth: "token",
      handler: AddressesController.list
    }
  });
  server.route({
    method: "PUT",
    path: "/addresses/{currency}",
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
      handler: async (request, reply) => {

        let accountId = request.auth.credentials.accessToken.account_id;

        await DashPayoutAddress.save(accountId, request.payload.address)

        return { success: true };
      }
    }
  });
  server.route({
    method: "GET",
    path: "/account",
    config: {
      auth: "token",
      handler: AccountsController.show
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
