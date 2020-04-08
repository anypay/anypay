"use strict";
require('dotenv').config();

import('bitcore-lib')

import * as Hapi from "hapi";

import { log } from '../../lib';
import { channel, awaitChannel } from '../../lib/amqp';

import { attachMerchantMapRoutes } from '../map/server';

import { validateToken } from '../auth/hapi_validate_token';

const HapiSwagger = require("hapi-swagger");

import * as pricesActor from '../../actors/prices/actor';
import * as ActivateDeactivateCoinActor from '../../actors/activate_deactivate_coin/actor';
import * as sudoAddresses from './handlers/sudo_addresses';
import * as sudoBankAccounts from './handlers/sudo_bank_accounts';

import { hash, bcryptCompare } from '../../lib/password';

import { accountCSVReports } from './handlers/csv_reports';

import { parseUnconfirmedTxEventToPayments } from '../../plugins/dash/lib/blockcypher';
import * as AddressRoutes from './handlers/address_routes';

/* Import all handlers from './handlers directory */
import { requireHandlersDirectory } from '../../lib/rabbi_hapi';
import { join } from 'path';
const handlers = requireHandlersDirectory(join(__dirname, './handlers'));
/* end handlers import */

import * as dashtext from '../../lib/dash/dashtext';

const sudoWires = require("./handlers/sudo/wire_reports");
const SudoCoins = require("./handlers/sudo_coins");
const TipJars = require("./handlers/tipjars");
const SudoAccounts = require("./handlers/sudo/accounts");
const DenominationsController = require("./handlers/denominations");
const PasswordsController = require("./handlers/passwords");
const AccessTokensController = require("./handlers/access_tokens");
const AddressesController = require("./handlers/addresses");
const CoinsController = require("./handlers/coins");
const AccountLogin = require("../../lib/account_login");
const sequelize = require("../../lib/database");
const EventEmitter = require("events").EventEmitter;
const InvoicesController = require("./handlers/invoices");
const DashBoardController = require("./handlers/dashboard");
const AmbassadorsController = require("./handlers/ambassadors");
const DashWatchController = require("./handlers/dashwatch_reports");
const WebhookHandler = new EventEmitter();
const PaymentRequestHandler = require("./handlers/payment_request");
import * as SudoPaymentForwards from "./handlers/payment_forwards";
import * as CoinOraclePayments from "./handlers/coin_oracle_payments";

import { sudoLogin } from './handlers/sudo_login';
import * as sudoTipjars from './handlers/sudo/tipjars';
import * as CashbackMerchants from './handlers/cashback_merchants';
const Joi = require('joi');

import {dashbackTotalsAlltime} from './handlers/dashback_controller';
import {dashbackTotalsByMonth} from './handlers/dashback_controller';

import { validateSudoPassword } from './auth/sudo_admin_password';
import { httpAuthCoinOracle } from './auth/auth_coin_oracle';

import {createConversion } from '../../lib/prices';
import { getPriceOfOneDollarInVES } from '../../lib/prices/ves';

import * as monthlyChartsController from './handlers/monthly_totals';
import * as accountMonthlyChartsController from './handlers/account_monthly_totals';
import * as totals from './handlers/totals';
import { models } from '../../lib'
import {createCoinTextInvoice} from '../../lib/cointext'

import * as ACHs from './handlers/achs';

const currencyMap = require('../../config/currency_map.js')

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

  try {

    var accessToken = await AccountLogin.withEmailPassword(username, password);

    if (accessToken) {

      return {
        isValid: true,
        credentials: { accessToken, account }
      };

    }
  } catch(error) {

    log.error(error.message);

  }

  log.info('NO VALID USER PASSWORD');
  log.info('CHECKING SUDO PASSWORD');

  // check for sudo password
  try {
    log.info('password', password);
    log.info('hash', process.env.SUDO_PASSWORD_HASH);

    await bcryptCompare(password, process.env.SUDO_PASSWORD_HASH);

    log.info('compare.success');

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

  console.log(`access token created: ${isNew}`, accessToken.toJSON());

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
  server.auth.strategy("password", "basic", { validate: validatePassword });
  server.auth.strategy("adminwebtoken", "basic", { validate: validateAdminToken });
  server.auth.strategy("sudopassword", "basic", { validate: validateSudoPassword});
  server.auth.strategy("authoracle", "basic", { validate: httpAuthCoinOracle});

  attachMerchantMapRoutes(server);

  server.route({
    method: "GET",
    path: "/invoices/{invoice_id}",
    handler: InvoicesController.show,
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
    path: "/invoices/{invoice_uid}/payment_options",
    handler: handlers.InvoicePaymentOptions.show,
    options: {
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/invoices",
    handler: InvoicesController.index,
    options: {
      auth: "token",
      tags: ['api'],
      plugins: responsesWithSuccess({ model: DashBoardController.IndexResponse })
    }
  });
  server.route({
    method: "GET",
    path: "/dashboard",
    handler: DashBoardController.index,
    options: {
      auth: "token",
      plugins: responsesWithSuccess({ model: DashBoardController.IndexResponse })
    }
  });

  server.route({
    method: "POST",
    path: "/invoices/{uid}/replacements",
    handler: InvoicesController.replace,
    options: {
      auth: "token",
      tags: ['api'],
    }
  });

  server.route({

    method: "GET",
    path: "/tipjars/{currency}",
    handler: TipJars.show,
    options: {
      auth: "token"
    }
  });

  server.route({
    method: "GET",
    path: "/sudo/accounts/{account_id}/tipjars/{currency}",
    handler: sudoTipjars.show,
    options: {
      auth: "sudopassword"
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
    method: "GET",
    path: "/shares",
    handler: handlers.Shareholders.show,
    options: {
      auth: "token",
      tags: ['api']
    },
  });

  server.route({
    method: "POST",
    path: "/access_tokens",
    handler: AccessTokensController.create,
    options: {
      auth: "password",
      tags: ['api'],
      plugins: responsesWithSuccess({ model: models.AccessToken.Response })
    }
  });

  server.route({
    method: "GET",
    path: "/addresses",
    handler: AddressesController.list,
    options: {
      auth: "token",
      tags: ['api'],
      plugins: responsesWithSuccess({ model: AddressesController.PayoutAddresses }),
    }
  });

  server.route({
    method: "PUT",
    path: "/addresses/{currency}",
    handler: AddressesController.update,
    options: {
      auth: "token",
      tags: ['api'],
      validate: {
        params: {
          currency: Joi.string().required()
        },
        payload: AddressesController.PayoutAddressUpdate
      },
      plugins: responsesWithSuccess({ model: models.Account.Response })
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
    method: "GET",
    path: "/account/rewards",
    handler: handlers.Accounts.getRewards,
    options: {
      auth: "token",
      tags: ['api'],
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
    method: "GET",
    path: "/achs",
    handler: ACHs.index,
    options: {
      auth: "token",
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/achs/{account_ach_id}/invoices",
    handler: handlers.AccountAchInvoices.show,
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
    handler: CoinsController.list,
    options: {
      tags: ['api'],
      auth: "token",
      plugins: responsesWithSuccess({ model: CoinsController.CoinsIndexResponse }),
    }
  });

  server.route({
    method: "POST",
    path: "/invoices",
    handler: InvoicesController.create,
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
    method: "POST",
    path: "/accounts/{account_id}/invoices",
    handler: InvoicesController.createPublic,
    options: {
      auth: "getaccount",
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
    handler: PasswordsController.reset,
    options: {
      tags: ['api'],
      validate: {
        payload: PasswordsController.PasswordReset,
      },
      plugins: responsesWithSuccess({ model: PasswordsController.Success }),
    }
  });

  server.route({
    method: "POST",
    path: "/password-resets/{uid}",
    handler: PasswordsController.claim,
    options: {
      tags: ['api'],
      validate: {
        payload: PasswordsController.PasswordResetClaim,
      },
      plugins: responsesWithSuccess({ model: PasswordsController.Success }),
    }
  });

  server.route({
    method: "PUT",
    path: "/settings/denomination",
    handler: DenominationsController.update,
    options: {
      tags: ['api'],
      auth: "token"
    }
  });

  server.route({
    method: "GET",
    path: "/settings/denomination",
    handler: DenominationsController.show,
    options: {
      tags: ['api'],
      auth: "token"
    }
  });

  server.route({
    method: "GET",
    path: "/base_currencies",
    handler: async (request, h) => {

      var currencies = await Fixer.getCurrencies();

      var rates = currencies.rates;

      let vesPrice = ((await getPriceOfOneDollarInVES()) * currencies.rates['USD']);

      rates['VES'] = vesPrice;

      let sortedCurrencies = Object.keys(rates).sort();

      currencies.rates = sortedCurrencies.reduce((map, key) => {

        map[key] = rates[key];

        return map;

      }, {});

      return currencies;

    },
    options: {
      tags: ['api']
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/usd",
    handler: monthlyChartsController.usd
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/btc",
    handler: monthlyChartsController.btc
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/dash",
    handler: monthlyChartsController.dash
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/transactions/{coin}",
    handler: monthlyChartsController.totalTransactionsByCoin
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/bch",
    handler: monthlyChartsController.bch
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/total",
    handler: monthlyChartsController.total
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/accounts",
    handler: monthlyChartsController.accounts
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/denomination/{denomination}",
    handler: monthlyChartsController.denomination
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/denominations",
    handler: monthlyChartsController.denominations
  });

  server.route({
    method: "GET",
    path: "/account/totals/monthly/{currency}",
    handler: accountMonthlyChartsController.byCurrency,
    options: {
      auth: "token"
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/count",
    handler: monthlyChartsController.count
  });

  server.route({
    method: "GET",
    path: "/dashback/totals/alltime",
    handler: dashbackTotalsAlltime
  });

  server.route({
    method: "GET",
    path: "/dashback/totals/monthly",
    handler: dashbackTotalsByMonth
  });

  server.route({
    method: "GET",
    path: "/totals/merchants",
    handler: totals.merchants
  });

  server.route({
    method: 'GET',
    path: '/ambassador_claims',
    handler: AmbassadorsController.list_account_claims,
    options: {
      auth: "token"
    }
  });

  server.route({
    method: 'POST',
    path: '/ambassador_claims',
    handler: AmbassadorsController.claim_merchant,
    options: {
      auth: "token"
    }
  });
  
  server.route({
    method: "GET",
    path: "/sudo/tokenvalidations",
    handler: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {

      return {
        token: req.auth['token']
      };
    },
    options: {
      auth: "adminwebtoken"
    }
  });

  server.route({
    method: "GET",
    path: "/convert/{oldamount}-{oldcurrency}/to-{newcurrency}",
    handler: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {

      let inputAmount = {

        currency: req.params.oldcurrency,

        value: parseFloat(req.params.oldamount)

      };

      let conversion = await createConversion(inputAmount, req.params.newcurrency);

      return {conversion};
    },
    options: {
      tags: ['api']
    }
  });

  server.route({
    method: "POST",
    path: "/{input_currency}/payments",
    handler: CoinOraclePayments.create,
    options: {
      tags: ['api'],
      validate: {
        payload: {
          amount: Joi.required(),
          currency: Joi.string().required(),
          address: Joi.string().required(),
          hash: Joi.string().required(),
          output_hash: Joi.string().optional(),
          output_amount: Joi.optional(),
          output_address: Joi.string().optional(),
          output_currency: Joi.string().optional()
        },
      },
      auth: 'authoracle'
    }
  });

  server.route({
    method: "GET",
    path: "/invoices/{uid}/bip70",
    handler: handlers.PaymentRequest.show 

  })

  server.route({
    method: "POST",
    path: "/invoices/{uid}/bip70",
    handler: handlers.PaymentRequest.create 

  })

  server.route({
    method: "GET",
    path: "/r/{uid}",
    handler: handlers.BsvPaymentRequest.show 
  })

  server.route({
    method: "POST",
    path: "/invoices/{uid}/pay",
    handler: handlers.BsvPaymentRequest.create 

  })


  server.route({
    method: "POST",
    path: "/invoices/{uid}/dashtext_payments",
    handler: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {

      let invoice = await models.Invoice.findOne({ where: {
      
        uid: req.params.uid

      }})

      let code = await dashtext.generateCode(
        invoice.address,
        invoice.invoice_amount,
        invoice.uid
      );

      return code;
 
    },
    options: {
      tags: ['api']
    }
  });

  server.route({
    method: "POST",
    path: "/invoices/{uid}/cointext_payments",
    handler: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {

    let invoice = await models.Invoice.findOne({ where: {
    
      uid: req.params.uid

    }})

      return  createCoinTextInvoice(invoice.address, invoice.invoice_amount, invoice.invoice_currency)
 
    },
    options: {
      tags: ['api']
    }
  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/auth',

    options: {

      auth: 'sudopassword',

      handler: sudoLogin

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/wires/reportsinceinvoice/{invoice_uid}',

    options: {

      auth: 'sudopassword',

      handler: sudoWires.show

    }

  });

 //deprecated
  server.route({

    method: 'PUT',

    path: '/sudo/accounts/{id}',

    options: {

      auth: 'sudopassword',

      handler: SudoAccounts.update,

      validate: {

        payload: {

          denomination: Joi.string().optional(),

          physical_address: Joi.string().optional(),

          business_name: Joi.string().optional(),

          latitude: Joi.number().optional(),

          longitude: Joi.number().optional(),

          image_url: Joi.string().optional()

        }

      }

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/addresses',

    options: {

      auth: 'sudopassword',

      handler: sudoAddresses.index

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/bank_accounts',

    options: {

      auth: 'sudopassword',

      handler: sudoBankAccounts.index

    }

  });

  //deprecated
  server.route({

    method: 'POST',

    path: '/sudo/bank_accounts',

    options: {

      auth: 'sudopassword',

      handler: sudoBankAccounts.create

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/bank_accounts/{id}',

    options: {

      auth: 'sudopassword',

      handler: sudoBankAccounts.show

    }

  });

  //deprecated
  server.route({

    method: 'DELETE',

    path: '/sudo/bank_accounts/{id}',

    options: {

      auth: 'sudopassword',

      handler: sudoBankAccounts.del

    }

  });

  //deprecated
  server.route({

    method: 'POST',

    path: '/sudo/accounts/{account_id}/addresses/{currency}/locks',

    options: {

      auth: 'sudopassword',

      handler: sudoAddresses.lockAddress

    }

  });

  //deprecated
  server.route({

    method: 'DELETE',

    path: '/sudo/accounts/{account_id}/addresses/{currency}/locks',

    options: {

      auth: 'sudopassword',

      handler: sudoAddresses.unlockAddress

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/dashback/merchants',

    options: {

      auth: 'sudopassword',

      handler: CashbackMerchants.sudoList

    }

  });

  //derecated
  server.route({

    method: 'GET',

    path: '/sudo/dashback/merchants/{email}',

    options: {

      auth: 'sudopassword',

      handler: CashbackMerchants.sudoShow

    }

  });

  //deprecated
  server.route({

    method: 'POST',

    path: '/sudo/dashback/merchants/{email}/activate',

    options: {

      auth: 'sudopassword',

      handler: CashbackMerchants.sudoActivate

    }

  });

  //deprecated
  server.route({

    method: 'POST',

    path: '/sudo/dashback/merchants/{email}/deactivate',

    options: {

      auth: 'sudopassword',

      handler: CashbackMerchants.sudoDeactivate

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/accounts',

    options: {

      auth: 'sudopassword',

      handler: handlers.Accounts.index

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/payment_forwards',

    options: {

      auth: 'sudopassword',

      handler: SudoPaymentForwards.index

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/payment_forwards/{id}',

    options: {

      auth: 'sudopassword',

      handler: SudoPaymentForwards.show

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/invoices',

    options: {

      auth: 'sudopassword',

      handler: InvoicesController.sudoIndex

    }

  });

  //deprecated
  server.route({

    method: 'DELETE',

    path: '/sudo/accounts/{account_id}',

    options: {

      auth: 'sudopassword',

      handler: handlers.Accounts.destroy

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/accounts/{account_id}',

    options: {

      auth: 'sudopassword',

      handler: handlers.Accounts.sudoShow

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/account-by-email/{email}',

    options: {

      auth: 'sudopassword',

      handler: handlers.Accounts.sudoAccountWithEmail

    }

  });

  server.route({

    method: 'GET',

    path: '/sudo/ambassadors',

    options: {

      auth: 'sudopassword',

      handler: AmbassadorsController.list

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/coins',

    options: {

      auth: 'sudopassword',

      handler: SudoCoins.list

    }
  });

  //deprecated
  server.route({

    method: 'POST',

    path: '/sudo/coins/activate',

    options: {

      auth: 'sudopassword',

      handler: SudoCoins.activate

    }

  });

  //deprecated
  server.route({

    method: 'POST',

    path: '/sudo/coins/deactivate',

    options: {

      auth: 'sudopassword',

      handler: SudoCoins.deactivate

    }

  });

  server.route({

    method: 'GET',

    path: '/dashwatch/reports/{month}',

    options: {

      handler: DashWatchController.reportForMonth

    }

  });

  server.route({

    method: 'GET',

    path: '/merchants',

    options: {

      handler: handlers.Merchants.listActiveSince

    }

  });

  server.route({

    method: 'GET',

    path: '/active-merchants',

    options: {

      handler: handlers.Merchants.listActiveSince

    }

  });



  server.route({

    method: 'GET',

    path: '/active-merchant-coins',

    options: {

      handler: handlers.Merchants.listMerchantCoins

    }

  });
  server.route({

    method: 'POST',

    path: '/test/webhooks',

    options: {

      handler: async function(req, h) {

        log.info('WEBHOOK', req.payload)

        return true;

      }

    }
  });

  server.route({

    method: 'GET',

    path: '/address_routes/{input_currency}/{input_address}',

    options: {

      auth: "authoracle",

      handler: AddressRoutes.show

    }

  });

  server.route({
    method: "GET",
    path: "/accounts/roi",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.Accounts.calculateROI

    }
  });

  server.route({
    method: "GET",
    path: "/kiosks",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.Kiosks.index
    }
  });

  server.route({
    method: "GET",
    path: "/kiosks/{kiosk_id}/transactions",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.KioskTransactions.index
    }
  });

  server.route({
    method: "GET",
    path: "/square/locations",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.SquareLocations.index
    }
  });

  server.route({
    method: "GET",
    path: "/square/locations/{location_id}",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.SquareLocations.show
    }
  });

  server.route({
    method: "GET",
    path: "/square/locations/{location_id}/orders",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.SquareOrders.index
    }
  });

  server.route({
    method: "GET",
    path: "/square/orders/{order_id}",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.SquareOrders.show
    }
  });

  server.route({
    method: "GET",
    path: "/square/catalog",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.SquareCatalogObjects.index
    }
  });

  server.route({
    method: "GET",
    path: "/square/catalog/{object_id}",
    options: {
      auth: "token",
      tags: ['api'],
      handler: handlers.SquareCatalogObjects.show
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
    method: "GET",
    path: "/currency-map",
    options: {
      //tags: ['api'],
      handler:(req: Hapi.Request, h: Hapi.ResponseToolkit) => {

        return currencyMap.map

      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/account/watch_address_webhook',
    options: {
      auth: 'token',
      validate: {
        payload: Joi.object().keys({
          webhook_url: Joi.string().uri().required()
        })
      },

      handler: async (req: Hapi.Request, h) => {

        req['account']['watch_address_webhook_url'] = req.payload['webhook_url']

        try {

          await req['account'].save();

          return { success: true}

        } catch(error) {

          return { success: false}

        }

      }
    }
  });

  server.route({

    method: 'POST',
    path: '/dash/watch_addresses',

    options: {

      auth: "token",

      handler: async (req: any, h) => {

        await awaitChannel();

        switch(req.account.email) {

        case 'lorenzo@dashtext.io':

          break;

        case 'steven@anypay.global':

          break;

        default:

          console.log('not authorized');

          return {succes: false}

        }

        let buffer = Buffer.from(JSON.stringify({
          account_email: req.account.email,
          address: req.payload.address
        }))

        await channel.publish('anypay.payments', 'addresses.watch', buffer);

        return { success: true }

      }

    }
  }); 

  accountCSVReports(server);

  server.route({

    method: 'GET',

    path: '/{param*}',

    handler: {

      directory: {

        path: '.',

        redirectToSlash: true,

        index: true,

      }

    }

  });

  return server;

}


  

if (require.main === module) {

  start();
}

async function start () {

  if (process.env.START_PRICES_ACTOR) {

    pricesActor.start();

  }

  ActivateDeactivateCoinActor.start();

  await sequelize.sync()

  var server = await Server();

  // Start the server
  await server.start();

  log.info("Server running at:", server.info.uri);

}

export { Server, start }

