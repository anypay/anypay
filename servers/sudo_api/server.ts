require('dotenv').config()

import * as Hapi from 'hapi';

import { log, database, models } from '../../lib';

import { validateSudoPassword } from './auth/sudo_admin_password';

import { sendWebhookForInvoice } from '../../lib/webhooks';

import * as cashbackMerchants from './handlers/cashback_merchants';
import * as cashback from './handlers/cashback';
import * as simplewallets from './handlers/simple_wallets';
import * as accountInvoices from './handlers/account_invoices';

const sudoWires = require("./handlers/wire_reports");

const SudoAccounts = require("./handlers/sudo_accounts");

const AccountsController = require("./handlers/accounts");

const InvoicesController = require("./handlers/invoices");

const SudoCoins = require("./handlers/sudo_coins");

import { sudoLogin } from './handlers/sudo_login';

import * as CashbackMerchants from './handlers/cashback_merchants';

import * as SudoPaymentForwards from "./handlers/payment_forwards";

import * as sudoBankAccounts from './handlers/sudo_bank_accounts';

import * as sudoAddresses from './handlers/sudo_addresses';

import * as sudoTipjars from './handlers/tipjars';

import * as passwords from './handlers/passwords';

import * as Joi from 'joi';

async function Server() {

  var server = new Hapi.Server({
    host: "0.0.0.0",
    port:  8100,
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
  server.auth.strategy("sudopassword", "basic", { validate: validateSudoPassword});

  server.route({

    method: "GET",

    path: "/api/merchant_groups",

    config: {

      auth: "sudopassword",

      handler: async (req, h) => {

        return models.MerchantGroup.findAll()

      }

    }

  });


  server.route({

    method: 'DELETE',

    path: '/api/accounts/{account_id}',

    config: {

      auth: 'sudopassword',

      handler: AccountsController.destroy

    }

  });

  server.route({

    method: 'GET',

    path: '/api/accounts/{account_id}',

    config: {

      auth: 'sudopassword',

      handler: AccountsController.sudoShow

    }

  });

  server.route({

    method: 'GET',

    path: '/api/account-by-email/{email}',

    config: {

      auth: 'sudopassword',

      handler: AccountsController.sudoAccountWithEmail

    }

  });

  server.route({

    method: 'GET',

    path: '/api/coins',

    config: {

      auth: 'sudopassword',

      handler: SudoCoins.list

    }
  });

  server.route({

    method: 'POST',

    path: '/api/coins/activate',

    config: {

      auth: 'sudopassword',

      handler: SudoCoins.activate

    }

  });

  server.route({

    method: 'POST',

    path: '/api/coins/deactivate',

    config: {

      auth: 'sudopassword',

      handler: SudoCoins.deactivate

    }

  });


  server.route({

    method: 'GET',

    path: '/api/accounts',

    config: {

      auth: 'sudopassword',

      handler: AccountsController.index

    }

  });
 

  server.route({

    method: 'GET',

    path: '/api/payment_forwards',

    config: {

      auth: 'sudopassword',

      handler: SudoPaymentForwards.index

    }

  });

  server.route({

    method: 'GET',

    path: '/api/payment_forwards/{id}',

    config: {

      auth: 'sudopassword',

      handler: SudoPaymentForwards.show

    }

  });

  server.route({

    method: 'GET',

    path: '/api/invoices',

    config: {

      auth: 'sudopassword',

      handler: InvoicesController.sudoIndex

    }

  });
        
  server.route({

    method: 'GET',

    path: '/api/invoices/{invoice_id}',

    config: {

      auth: 'sudopassword',

      handler: InvoicesController.sudoShow

    }

  });

  server.route({

    method: 'GET',

    path: '/api/addresses',

    config: {

      auth: 'sudopassword',

      handler: sudoAddresses.index

    }

  });

  server.route({

    method: 'POST',

    path: '/api/accounts/{account_id}/addresses/{currency}/locks',

    config: {

      auth: 'sudopassword',

      handler: sudoAddresses.lockAddress

    }

  });

  server.route({

    method: 'DELETE',

    path: '/api/accounts/{account_id}/addresses/{currency}/locks',

    config: {

      auth: 'sudopassword',

      handler: sudoAddresses.unlockAddress

    }

  });

  server.route({

    method: 'GET',

    path: '/api/cashback/merchants',

    config: {

      auth: 'sudopassword',

      handler: CashbackMerchants.sudoList

    }

  });

  server.route({

    method: 'GET',

    path: '/api/cashback/merchants/{email}',

    config: {

      auth: 'sudopassword',

      handler: CashbackMerchants.sudoShow

    }

  });

  server.route({

    method: 'POST',

    path: '/api/cashback/merchants/{email}/activate',

    config: {

      auth: 'sudopassword',

      handler: CashbackMerchants.sudoActivate

    }

  });

  server.route({

    method: 'POST',

    path: '/api/cashback/merchants/{email}/deactivate',

    config: {

      auth: 'sudopassword',

      handler: CashbackMerchants.sudoDeactivate

    }

  });



  server.route({

    method: 'PUT',

    path: '/api/accounts/{id}',

    config: {

      auth: 'sudopassword',

      handler: SudoAccounts.update

    }

  });

  server.route({

    method: 'GET',

    path: '/api/bank_accounts',

    config: {

      auth: 'sudopassword',

      handler: sudoBankAccounts.index

    }

  });

  server.route({

    method: 'POST',

    path: '/api/bank_accounts',

    config: {

      auth: 'sudopassword',

      handler: sudoBankAccounts.create

    }

  });

  server.route({

    method: 'GET',

    path: '/api/bank_accounts/{id}',

    config: {

      auth: 'sudopassword',

      handler: sudoBankAccounts.show

    }

  });

  server.route({

    method: 'DELETE',

    path: '/api/bank_accounts/{id}',

    config: {

      auth: 'sudopassword',

      handler: sudoBankAccounts.del

    }

  });


  server.route({

    method: 'GET',

    path: '/api/auth',

    config: {

      auth: 'sudopassword',

      handler: sudoLogin

    }

  });

  server.route({

    method: "GET",

    path: "/api/simple_wallets",

    config: {

      auth: "sudopassword",

      handler: simplewallets.index

    }

  });

  server.route({

    method: "GET",

    path: "/api/search/invoices/{search}",

    config: {

      auth: "sudopassword",

      handler: async (req, h) => {
             
          var invoice;

          invoice = await models.Invoice.findOne({
            where: {
              uid: req.params.search
            } 
          });

          if (!invoice) {

            invoice = await models.Invoice.findOne({
              where: {
                address: req.params.search
              } 
            });

          }

          if (!invoice) {

            invoice = await models.Invoice.findOne({
              where: {
                external_id: req.params.search
              } 
            });

          }

          if (!invoice) {

            invoice = await models.Invoice.findOne({
              where: {
                hash: req.params.search
              } 
            });

          }

          if (!invoice) {
            throw new Error(`invoice search not found ${req.params.search}`);
          }

          return { invoice };

      }

    }

  });

  server.route({

    method: "POST",

    path: "/api/invoices/{uid}/webhooks",

    config: {

      auth: "sudopassword",

      handler: async (req, h) => {

        try{

          let resp = await sendWebhookForInvoice(req.params.uid); 

          return resp.body;

        }catch(err){

          console.log(err)

        }
      }

    }

  });

  server.route({

    method: 'GET',

    path: "/api/merchant_groups/{id}",

    config: {

      auth: "sudopassword",

      handler: async (req, h) => {

        let merchantGroup = await models.MerchantGroup.findOne({ where: {

          id: req.params.id

        }});

        let groupMembers = await models.MerchantGroupMember.findAll({ where: {

          merchant_group_id: merchantGroup.id

        }});

        return {

          merchant_group: merchantGroup,

          merchant_group_members: groupMembers

        };

      }

    }

  });

  server.route({

    method: 'GET',

    path: "/api/cashback/dashboard",

    config: {

      auth: "sudopassword",

      handler: cashback.dashboard

    }
  });

  server.route({

    method: 'GET',

    path: "/api/accounts/{id}/invoices",

    config: {

      auth: "sudopassword",

      handler: accountInvoices.show

    }
  });


  server.route({

    method: 'PUT',

    path: "/api/accounts/{account_id}/passwords",

    config: {

      auth: "sudopassword",

      handler: passwords.update,

      validate: {

        payload: {

          password: Joi.string(),

          password_confirmation: Joi.string()

        }

      }

    }
  });

  server.route({

    method: "GET",
    path: "/api/accounts/{account_id}/tipjars/{currency}",
    config: {
      auth: "sudopassword",
      handler: sudoTipjars.show
    }
  });


  server.route({

    method: 'GET',

    path: '/api/wires/reportsinceinvoice/{invoice_uid}',

    config: {

      auth: 'sudopassword',

      handler: sudoWires.show

    }

  });

  server.route({

    method: 'GET',

    path: '/api/wires/reportsinceinvoice/{invoice_uid}/csv',

    config: {

      auth: 'sudopassword',

      handler: sudoWires.showCSV

    }

  });


  return server;

}



async function start() {

 try{
  await database.sync()

  var server = await Server();

  // Start the server
  await server.start();

  log.info("Server running at:", server.info.uri);
 }catch(err){

   console.log(err)

 }

}

if (require.main === module) {

  start()

}

export {

  start

}

