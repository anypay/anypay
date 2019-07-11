"use strict";
require('dotenv').config();

import * as Hapi from "hapi";

import { log } from '../../lib';
import { channel } from '../../lib/amqp';

const AccessToken = require("../../lib/models/access_token");
const Account = require("../../lib/models/account");
const Invoice = require("../../lib/models/invoice");
const HapiSwagger = require("hapi-swagger");

import * as pricesActor from '../../actors/prices/actor';
import * as addressRoutesActor from '../../actors/address_routes/actor';
import * as sudoAddresses from './handlers/sudo_addresses';
import * as sudoBankAccounts from './handlers/sudo_bank_accounts';

import { accountCSVReports } from './handlers/csv_reports';

import { parseUnconfirmedTxEventToPayments } from '../../plugins/dash/lib/blockcypher';
import * as BCHAddressForwardCallbacks from './handlers/bch_address_forward_callbacks';
import * as DASHAddressForwardCallbacks from './handlers/dash_address_forward_callbacks';
import * as ZENAddressForwardCallbacks from './handlers/zen_address_forward_callbacks';
import * as ZECAddressForwardCallbacks from './handlers/zec_address_forward_callbacks';
import * as LTCAddressForwardCallbacks from './handlers/ltc_address_forward_callbacks';
import * as DOGEAddressForwardCallbacks from './handlers/doge_address_forward_callbacks';
import * as SMARTAddressForwardCallbacks from './handlers/smart_address_forward_callbacks';
import * as RVNAddressForwardCallbacks from './handlers/rvn_address_forward_callbacks';
import * as AddressSubscriptionCallbacks from './handlers/subscription_callbacks';
import * as AddressRoutes from './handlers/address_routes';

const sudoWires = require("./handlers/sudo/wire_reports");
const AccountsController = require("./handlers/accounts");
const SudoCoins = require("./handlers/sudo_coins");
const TipJars = require("./handlers/tipjars");
const SudoAccounts = require("./handlers/sudo/accounts");
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
const AmbassadorsController = require("./handlers/ambassadors");
const DashWatchController = require("./handlers/dashwatch_reports");
const MerchantsController = require("./handlers/merchants");
const WebhookHandler = new EventEmitter();
import * as SudoPaymentForwards from "./handlers/payment_forwards";
import * as CoinOraclePayments from "./handlers/coin_oracle_payments";

import { sudoLogin } from './handlers/sudo_login';
import * as sudoTipjars from './handlers/sudo/tipjars';
import * as CashbackMerchants from './handlers/cashback_merchants';
const Joi = require('joi');

import {createLinks} from './handlers/links_controller';
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
  if (!username || !password) {
    return {
      isValid: false
    };
  }

  var accessToken = await AccountLogin.withEmailPassword(username, password);

  console.log('got access token');

  var account = await models.Account.findOne({
    where: {
      id: accessToken.account_id
    }
  });

  console.log('got account');

  if (accessToken) {

    return {
      isValid: true,
      credentials: { accessToken, account }
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
  server.auth.strategy("sudopassword", "basic", { validate: validateSudoPassword});
  server.auth.strategy("authoracle", "basic", { validate: httpAuthCoinOracle});
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
      //tags: ['api'],
      handler: DashBoardController.index,
      plugins: responsesWithSuccess({ model: DashBoardController.IndexResponse })
    }
  });
  server.route({
    method: "POST",
    path: "/pair_tokens",
    config: {
      auth: "token",
      //tags: ['api'],
      handler: PairTokensController.create
    }
  });
  server.route({
    method: "GET",
    path: "/pair_tokens",
    config: {
      auth: "token",
      //tags: ['api'],
      handler: PairTokensController.show
    }
  });

  server.route({
    method: "POST",
    path: "/invoices/{uid}/replacements",
    config: {
      auth: "token",
      tags: ['api'],
      handler: InvoicesController.replace
    }
  });
  server.route({
    method: "POST",
    path: "/bch/invoices",
    config: {
      auth: "token",
      //tags: ['api'],
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
      //tags: ['api'],
      validate: {
        payload: Invoice.Request,
      },
      handler: ZcashInvoicesController.create,
      plugins: responsesWithSuccess({ model: Invoice.Response }),
    }
  });

  server.route({

    method: "GET",
    path: "/tipjars/{currency}",
    config: {
      auth: "token",
      handler: TipJars.show
    }
  });

  server.route({

    method: "GET",
    path: "/sudo/accounts/{account_id}/tipjars/{currency}",
    config: {
      auth: "sudopassword",
      handler: sudoTipjars.show
    }
  });

  server.route({
    method: "POST",
    path: "/btc.lightning/invoices",
    config: {
      auth: "token",
      //tags: ['api'],
      validate: {
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
      //tags: ['api'],
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
      //tags: ['api'],
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
      //tags: ['api'],
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
      //tags: ['api'],
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
    method: "PUT",
    path: "/anonymous-accounts",
    config: {
      auth: "token",
      tags: ['api'],
      validate: {
        payload: Account.Credentials,
      },
      handler: AccountsController.registerAnonymous,
      plugins: responsesWithSuccess({ model: Account.Response }),
    },
  });

  server.route({
    method: "POST",
    path: "/anonymous-accounts",
    config: {
      tags: ['api'],
      handler: AccountsController.createAnonymous,
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
    method: "PUT",
    path: "/account",
    config: {
      auth: "token",
      tags: ['api'],
      handler: AccountsController.update
    }
  });
  server.route({
    method: "GET",
    path: "/extended_public_keys",
    config: {
      auth: "token",
      //tags: ['api'],
      handler: ExtendedPublicKeysController.index
    }
  });
  server.route({
    method: "POST",
    path: "/extended_public_keys",
    config: {
      auth: "token",
      //tags: ['api'],
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
      //tags: ['api'],
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

        var rates = currencies.rates;

        let vesPrice = ((await getPriceOfOneDollarInVES()) * currencies.rates['USD']);

        rates['VES'] = vesPrice;

        let sortedCurrencies = Object.keys(rates).sort();

        currencies.rates = sortedCurrencies.reduce((map, key) => {

          map[key] = rates[key];

          return map;

        }, {});

        return currencies;

      }
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/usd",
    config: {
      //tags: ['api'],
      handler: monthlyChartsController.usd
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/btc",
    config: {
      //tags: ['api'],
      handler: monthlyChartsController.btc
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/dash",
    config: {
      //tags: ['api'],
      handler: monthlyChartsController.dash
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/transactions/{coin}",
    config: {
      //tags: ['api'],
      handler: monthlyChartsController.totalTransactionsByCoin
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/bch",
    config: {
      //tags: ['api'],
      handler: monthlyChartsController.bch
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/total",
    config: {
      //tags: ['api'],
      handler: monthlyChartsController.total
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/accounts",
    config: {
      //tags: ['api'],
      handler: monthlyChartsController.accounts
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/denomination/{denomination}",
    config: {
      //tags: ['api'],
      handler: monthlyChartsController.denomination
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/denominations",
    config: {
      //tags: ['api'],
      handler: monthlyChartsController.denominations
    }
  });

  server.route({
    method: "GET",
    path: "/account/totals/monthly/{currency}",
    config: {
      auth: "token",
      //tags: ['api'],
      handler: accountMonthlyChartsController.byCurrency
    }
  });

  server.route({
    method: "GET",
    path: "/totals/monthly/count",
    config: {
      //tags: ['api'],
      handler: monthlyChartsController.count
    }
  });

  server.route({
    method: "POST",
    path: "/links",
    config: {
      //tags: ['api'],
      handler: createLinks
    }
  });

  server.route({
    method: "GET",
    path: "/dashback/totals/alltime",
    config: {
      //tags: ['api'],
      handler: dashbackTotalsAlltime
    }
  });

  server.route({
    method: "GET",
    path: "/dashback/totals/monthly",
    config: {
      //tags: ['api'],
      handler: dashbackTotalsByMonth
    }
  });

  server.route({
    method: "GET",
    path: "/totals/merchants",
    config: {
      //tags: ['api'],
      handler: totals.merchants
    }
  });

  server.route({
    method: 'GET',
    path: '/ambassador_claims',
    config: {
      auth: "token",
      handler: AmbassadorsController.list_account_claims
    }
  });

  server.route({
    method: 'POST',
    path: '/ambassador_claims',
    config: {
      auth: "token",
      handler: AmbassadorsController.claim_merchant
    }
  });
  
  server.route({
    method: "GET",
    path: "/sudo/tokenvalidations",
    config: {
      auth: "adminwebtoken",
      //tags: ['api'],
      handler: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {

        return {
          token: req.auth.token
        };
      }
    }
  });

  server.route({
    method: "GET",
    path: "/convert/{oldamount}-{oldcurrency}/to-{newcurrency}",
    config: {
      tags: ['api'],
      handler: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {

        let inputAmount = {

          currency: req.params.oldcurrency,

          value: req.params.oldamount

        };

        let conversion = await createConversion(inputAmount, req.params.newcurrency);

        return {conversion};
      }
    }
  });

  server.route({

    method: "POST",

    path: "/{input_currency}/payments",

    config: {

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

      auth: 'authoracle',

      handler: CoinOraclePayments.create  

    }

  });

  server.route({
    method: "POST",
    path: "/invoices/{uid}/cointext_payments",
    config: {
      tags: ['api'],
      handler: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {

      let invoice = await models.Invoice.findOne({ where: {
      
        uid: req.params.uid

      }})

        return  createCoinTextInvoice(invoice.address, invoice.invoice_amount, invoice.invoice_currency)
	 
      }
    }
  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/auth',

    config: {

      auth: 'sudopassword',

      handler: sudoLogin

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/wires/reportsinceinvoice/{invoice_uid}',

    config: {

      auth: 'sudopassword',

      handler: sudoWires.show

    }

  });

 //deprecated
  server.route({

    method: 'PUT',

    path: '/sudo/accounts/{id}',

    config: {

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

    config: {

      auth: 'sudopassword',

      handler: sudoAddresses.index

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/bank_accounts',

    config: {

      auth: 'sudopassword',

      handler: sudoBankAccounts.index

    }

  });

  //deprecated
  server.route({

    method: 'POST',

    path: '/sudo/bank_accounts',

    config: {

      auth: 'sudopassword',

      handler: sudoBankAccounts.create

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/bank_accounts/{id}',

    config: {

      auth: 'sudopassword',

      handler: sudoBankAccounts.show

    }

  });

  //deprecated
  server.route({

    method: 'DELETE',

    path: '/sudo/bank_accounts/{id}',

    config: {

      auth: 'sudopassword',

      handler: sudoBankAccounts.del

    }

  });

  //deprecated
  server.route({

    method: 'POST',

    path: '/sudo/accounts/{account_id}/addresses/{currency}/locks',

    config: {

      auth: 'sudopassword',

      handler: sudoAddresses.lockAddress

    }

  });

  //deprecated
  server.route({

    method: 'DELETE',

    path: '/sudo/accounts/{account_id}/addresses/{currency}/locks',

    config: {

      auth: 'sudopassword',

      handler: sudoAddresses.unlockAddress

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/dashback/merchants',

    config: {

      auth: 'sudopassword',

      handler: CashbackMerchants.sudoList

    }

  });

  //derecated
  server.route({

    method: 'GET',

    path: '/sudo/dashback/merchants/{email}',

    config: {

      auth: 'sudopassword',

      handler: CashbackMerchants.sudoShow

    }

  });

  //deprecated
  server.route({

    method: 'POST',

    path: '/sudo/dashback/merchants/{email}/activate',

    config: {

      auth: 'sudopassword',

      handler: CashbackMerchants.sudoActivate

    }

  });

  //deprecated
  server.route({

    method: 'POST',

    path: '/sudo/dashback/merchants/{email}/deactivate',

    config: {

      auth: 'sudopassword',

      handler: CashbackMerchants.sudoDeactivate

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/accounts',

    config: {

      auth: 'sudopassword',

      handler: AccountsController.index

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/payment_forwards',

    config: {

      auth: 'sudopassword',

      handler: SudoPaymentForwards.index

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/payment_forwards/{id}',

    config: {

      auth: 'sudopassword',

      handler: SudoPaymentForwards.show

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/invoices',

    config: {

      auth: 'sudopassword',

      handler: InvoicesController.sudoIndex

    }

  });

  //deprecated
  server.route({

    method: 'DELETE',

    path: '/sudo/accounts/{account_id}',

    config: {

      auth: 'sudopassword',

      handler: AccountsController.destroy

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/accounts/{account_id}',

    config: {

      auth: 'sudopassword',

      handler: AccountsController.sudoShow

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/account-by-email/{email}',

    config: {

      auth: 'sudopassword',

      handler: AccountsController.sudoAccountWithEmail

    }

  });

  server.route({

    method: 'GET',

    path: '/sudo/ambassadors',

    config: {

      auth: 'sudopassword',

      handler: AmbassadorsController.list

    }

  });

  //deprecated
  server.route({

    method: 'GET',

    path: '/sudo/coins',

    config: {

      auth: 'sudopassword',

      handler: SudoCoins.list

    }
  });

  //deprecated
  server.route({

    method: 'POST',

    path: '/sudo/coins/activate',

    config: {

      auth: 'sudopassword',

      handler: SudoCoins.activate

    }

  });

  //deprecated
  server.route({

    method: 'POST',

    path: '/sudo/coins/deactivate',

    config: {

      auth: 'sudopassword',

      handler: SudoCoins.deactivate

    }

  });

  server.route({

    method: 'GET',

    path: '/dashwatch/reports/{month}',

    config: {

      handler: DashWatchController.reportForMonth

    }

  });

  server.route({

    method: 'GET',

    path: '/merchants',

    config: {

      handler: MerchantsController.list

    }

  });

  server.route({

    method: 'GET',

    path: '/active-merchants',

    config: {

      handler: MerchantsController.listActiveSince

    }

  });



  server.route({

    method: 'GET',

    path: '/active-merchant-coins',

    config: {

      handler: MerchantsController.listMerchantCoins

    }

  });
  server.route({

    method: 'POST',

    path: '/test/webhooks',

    config: {

      handler: async function(req, h) {

        log.info('WEBHOOK', req.payload)

        return true;

      }

    }
  });

  server.route({

    method: 'POST',

    path: '/bch/address_forward_callbacks',

    config: {

      handler: BCHAddressForwardCallbacks.create

    }

  });

  server.route({

    method: 'POST',

    path: '/dash/address_forward_callbacks',

    config: {

      handler: DASHAddressForwardCallbacks.create

    }

  });



   server.route({

    method: 'POST',

    path: '/ltc/address_forward_callbacks',

    config: {

      handler: LTCAddressForwardCallbacks.create

    }

  });

  server.route({

    method: 'POST',

    path: '/zen/address_forward_callbacks',

    config: {

      handler: ZENAddressForwardCallbacks.create

    }

  });

  server.route({

    method: 'POST',

    path: '/zec/address_forward_callbacks',

    config: {

      auth: "sudopassword",
      
      handler: ZECAddressForwardCallbacks.create
    }

  })

  server.route({

    method: 'POST',

    path: '/doge/address_forward_callbacks',

    config: {

      handler: DOGEAddressForwardCallbacks.create

    }

  });


  server.route({

    method: 'POST',

    path: '/smart/address_forward_callbacks',

    config: {

      handler: SMARTAddressForwardCallbacks.create

    }

  });

  server.route({

    method: 'POST',

    path: '/rvn/address_forward_callbacks',

    config: {

      handler: RVNAddressForwardCallbacks.create

    }

  });

  server.route({

    method: 'POST',

    path: '/address_subscription_callbacks',

    config: {

      auth: "sudopassword",

      handler: AddressSubscriptionCallbacks.subscriptionCallback

    }

  });

  server.route({

    method: 'GET',

    path: '/address_routes/{input_currency}/{input_address}',

    config: {

      auth: "authoracle",

      handler: AddressRoutes.show

    }

  });

  server.route({
    method: "GET",
    path: "/accounts/roi",
    config: {
      auth: "token",
      tags: ['api'],
      handler: AccountsController.calculateROI

    }
  });

  server.route({
    method: "GET",
    path: "/roi",
    config: {
      tags: ['api'],
      handler: AccountsController.calculateTotalROI

    }
  });

  server.route({

    method: 'POST',

    path: '/blockcypher/webhooks/dash',

    config: {

      handler: async function(req, h) {

        log.info('blockcypher.webhook', req.payload);

        try {

          let hook = await models.BlockcypherEvent.create({
          
            type: 'unconfirmed-tx',

            payload: JSON.stringify(req.payload)

          });

          log.info('blockcypher.event.recorded', hook.toJSON());

          let payments = parseUnconfirmedTxEventToPayments(req.payload);

          payments.forEach(async (payment) => {

            log.info('payment', payment);

            await channel.publish('anypay.payments', 'payment', new Buffer(JSON.stringify(payment)));

          });

        } catch(error) {

          log.error(error.message);

        }

        return { success: true }

      }

    }

  });


  server.route({
    method: "GET",
    path: "/currency-map",
    config: {
      //tags: ['api'],
      handler:(req: Hapi.Request, h: Hapi.ResponseToolkit) => {

        return currencyMap.map

      }
    }
  });

  accountCSVReports(server);

  return server;

}

  

if (require.main === module) {

  start();
}

async function start () {

  if (process.env.START_PRICES_ACTOR) {

    pricesActor.start();

  }

//addressRoutesActor.start();

  await sequelize.sync()

  var server = await Server();

  // Start the server
  await server.start();

  log.info("Server running at:", server.info.uri);

}

export { Server, start }

