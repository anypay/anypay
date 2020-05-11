require('dotenv').config()

import * as Hapi from 'hapi';

import { log, database, models, password } from '../../lib';

import { validateSudoPassword } from './auth/sudo_admin_password';

import { sendWebhookForInvoice } from '../../lib/webhooks';
import * as Boom from 'boom';

import * as cashbackMerchants from './handlers/cashback_merchants';
import * as cashback from './handlers/cashback';
import * as simplewallets from './handlers/simple_wallets';
import * as accountInvoices from './handlers/account_invoices';

import { requireHandlersDirectory } from '../../lib/rabbi_hapi';

import { join } from 'path';

const handlers = requireHandlersDirectory(join(__dirname, 'handlers'))

import { sudoLogin } from './handlers/sudo_login';

import * as CashbackMerchants from './handlers/cashback_merchants';

import * as SudoPaymentForwards from "./handlers/payment_forwards";

import * as sudoBankAccounts from './handlers/sudo_bank_accounts';

import * as sudoAddresses from './handlers/sudo_addresses';

import * as vendingMachines from './handlers/vending_machines';

import * as sudoTipjars from './handlers/tipjars';

import * as passwords from './handlers/passwords';

import * as Joi from 'joi';

import * as uuid from 'uuid';

import { Subscriptions } from './lib/subscriptions';

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

  const io = require("socket.io")(server.listener);

  let wsSubscriptions = new Subscriptions();

  io.on("connection", client => {

    client.uid = uuid.v4();

    log.info("socket.connected", client.uid);

    client.on("subscribe", async (data) => {

      try {

        await password.bcryptCompare(data.token, process.env.SUDO_PASSWORD_HASH);

        wsSubscriptions.subscribe(client);

      } catch(error) {

        log.error('unauthorized', error.message);

        client.emit('unauthorized');

        client.disconnect();

      }
    });

    client.on("unsubscribe", data => {
      wsSubscriptions.unsubscribe(client);
    });

    client.on("disconnect", () => {

      wsSubscriptions.unsubscribeClient(client);

      log.info("socket.disconnected", client.uid);

    });

  });

  await server.register(require('hapi-auth-basic'));
  server.auth.strategy("sudopassword", "basic", { validate: validateSudoPassword});

  server.route({

    method: "GET",

    path: "/api/cash_deposits",

    config: {

      auth: "sudopassword",

      handler: handlers.CashDeposits.index,

    }

  });

  server.route({

    method: "POST",

    path: "/api/cash_deposits",

    config: {

      auth: "sudopassword",

      handler: handlers.CashDeposits.create,

      validate: {
        
        payload : {

          amount: Joi.number().required()

        }

      }

    }

  });

  server.route({

    method: "GET",

    path: "/api/bitpay_settlements/not_settled",

    config: {

      auth: "sudopassword",

      handler: handlers.BitpaySettlements.notSettled

    }

  });

  server.route({

    method: "GET",

    path: "/api/settlements/{invoice_uid}",

    config: {

      auth: "sudopassword",

      handler: handlers.BitpaySettlements.show

    }

  });

  server.route({

    method: "POST",

    path: "/api/bitpay_settlements",

    config: {

      auth: "sudopassword",

      handler: handlers.BitpaySettlements.create,

      validate: {
        
        payload : {

          invoice_uid: Joi.string().required()

        }

      }

    }

  });

  server.route({

    method: "GET",

    path: "/api/bitpay_settlements",

    config: {

      auth: "sudopassword",

      handler: handlers.BitpaySettlements.index

    }

  });

  server.route({

    method: "PUT",

    path: "/api/bitpay_settlements/{invoice_uid}",

    config: {

      auth: "sudopassword",

      handler: handlers.BitpaySettlements.update,

      validate: {
        
        payload : {

          txid: Joi.string().required(),

          currency: Joi.string().required(),

          amount: Joi.number().required()

        }

      }

    }

  });

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

    method: "GET",

    path: "/api/ach_batches",

    config: {

      auth: "sudopassword",

      handler: handlers.SudoAchBatches.index

    }

  });

  server.route({

    method: "POST",

    path: "/api/ach_batches",

    config: {

      auth: "sudopassword",

      handler: handlers.SudoAchBatches.create

    }

  });

  server.route({

    method: "GET",

    path: "/api/vending_machines",

    config: {

      auth: "sudopassword",

      handler: vendingMachines.index

    }

  });


  server.route({

    method: 'DELETE',

    path: '/api/accounts/{account_id}',

    config: {

      auth: 'sudopassword',

      handler: handlers.Accounts.destroy

    }

  });

  server.route({

    method: 'GET',

    path: '/api/accounts/{account_id}',

    config: {

      auth: 'sudopassword',

      handler: handlers.Accounts.sudoShow

    }

  });

  server.route({

    method: 'GET',

    path: '/api/account-by-email/{email}',

    config: {

      auth: 'sudopassword',

      handler: handlers.Accounts.sudoAccountWithEmail

    }

  });

  server.route({

    method: 'GET',

    path: '/api/coins',

    config: {

      auth: 'sudopassword',

      handler: handlers.SudoCoins.list

    }
  });

  server.route({

    method: 'POST',

    path: '/api/coins/activate',

    config: {

      auth: 'sudopassword',

      handler: handlers.SudoCoins.activate

    }

  });

  server.route({

    method: 'POST',

    path: '/api/coins/deactivate',

    config: {

      auth: 'sudopassword',

      handler: handlers.SudoCoins.deactivate

    }

  });


  server.route({

    method: 'GET',

    path: '/api/accounts',

    config: {

      auth: 'sudopassword',

      handler: handlers.Accounts.index

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

    path: '/api/shareholders',

    config: {

      auth: 'sudopassword',

      handler: handlers.Shareholders.index

    }

  });

  server.route({

    method: 'GET',

    path: '/api/payroll_accounts',

    config: {

      auth: 'sudopassword',

      handler: handlers.PayrollAccounts.index

    }

  });

  server.route({

    method: 'GET',

    path: '/api/payroll_batches',

    config: {

      auth: 'sudopassword',

      handler: handlers.PayrollBatches.index

    }

  });

  server.route({

    method: 'GET',

    path: '/api/shareholders/{id}',

    config: {

      auth: 'sudopassword',

      handler: handlers.Shareholders.show

    }

  });

  server.route({

    method: 'PUT',

    path: '/api/shareholders/{id}',

    config: {

      auth: 'sudopassword',

      handler: handlers.Shareholders.update

    }

  });

  server.route({

    method: 'GET',

    path: '/api/invoices',

    config: {

      auth: 'sudopassword',

      handler: handlers.Invoices.sudoIndex

    }

  });


  server.route({

    method: 'POST',

    path: '/api/invoices/republish-txid',

    config: {

      auth: 'sudopassword',

      handler: handlers.Invoices.sudoRepublishTxid,

      validate: {
        
        payload : {

          currency : Joi.string().required(),

          txid : Joi.string().required()

        }

      }

    }

  });


  server.route({

    method: 'GET',

    path: '/api/invoices/unrouted',

    config: {

      auth: 'sudopassword',

      handler: handlers.Invoices.sudoIndexUnrouted

    }

  });

  server.route({

    method: 'GET',

    path: '/api/prices',

    config: {

      auth: 'sudopassword',

      handler: handlers.Prices.sudoIndex

    }

  });
        
  server.route({

    method: 'GET',

    path: '/api/prices/{currency}',

    config: {

      auth: 'sudopassword',

      handler: handlers.Prices.sudoShow

    }

  });

  server.route({

    method: 'POST',

    path: '/api/prices',

    config: {

      auth: 'sudopassword',

      handler: handlers.Prices.sudoUpdate

    }

  });
        
  server.route({

    method: 'GET',

    path: '/api/invoices/{invoice_id}',

    config: {

      auth: 'sudopassword',

      handler: handlers.Invoices.sudoShow

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

    path: '/api/cashback/payments',

    config: {

      handler: cashback.index

    }

  });

  server.route({

    method: "POST",

    path: "/api/invoices/{invoice_uid}/cashback_payments",

    config: {

      auth: "sudopassword",

      handler: cashback.retry
    }

  });

  server.route({

    method: "GET",

    path: "/api/accounts/{account_id}/achs",

    config: {

      auth: "sudopassword",

      handler: handlers.Achs.index
    }

  });

  server.route({

    method: "GET",

    path: "/api/achs",

    config: {

      auth: "sudopassword",

      handler: handlers.Achs.index
    }

  });


  server.route({
    method: "GET",

    path: "/api/ach_batches/{ach_batch_id}",

    config: {

      auth: "sudopassword",

      handler: handlers.Achs.show
    }

  });

  server.route({

    method: "PUT",

    path: "/api/ach_batches/{id}",

    config: {

      auth: "sudopassword",

      handler: handlers.Achs.update
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

      handler: handlers.SudoAccounts.update,

      validate: {

        payload: {

           email: Joi.string().optional(),

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

          return Boom.badRequest(err.message);

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

    method: 'GET',

    path: "/api/accounts/{account_id}/addresses",

    config: {

      auth: "sudopassword",

      handler: handlers.Accounts.showAddresses

    }
  });

  server.route({

    method: 'GET',

    path: "/api/accounts/{account_id}/ambassador-rewards",

    config: {

      auth: "sudopassword",

      handler: handlers.Accounts.showAmbassadorRewards

    }
  });

  server.route({

    method: 'GET',

    path: "/api/accounts/{account_id}/kiosk-rewards",

    config: {

      auth: "sudopassword",

      handler: handlers.Accounts.showKioskRewards

    }
  });

  server.route({

    method: "GET",

    path: "/accounts/{id}/roi",

    config: {

      auth: "sudopassword",

      handler: handlers.Accounts.calculateROI

    }
  });

  server.route({

    method: "GET",

    path: "/accounts/{id}/volume",

    config: {

      auth: "sudopassword",

      handler: handlers.Accounts.accountVolume

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

      handler: handlers.WireReports.show

    }

  });

  server.route({

    method: 'GET',

    path: '/cities',

    config: {

      handler: handlers.Cities.index

    }

  });

  server.route({

    method: 'POST',

    path: '/cities',

    config: {

      handler: handlers.Cities.create

    }

  });

  server.route({

    method: 'PUT',

    path: '/cities/{id}',

    config: {

      handler: handlers.Cities.update

    }

  });

  server.route({

    method: 'GET',

    path: '/yelp_businesses',

    config: {

      handler: handlers.YelpBusinesses.index

    }

  });

  server.route({

    method: 'GET',

    path: '/api/cashback/failures',

    config: {

      auth: 'sudopassword',

      handler: handlers.CashbackFailures.index

    }

  });


  server.route({

    method: 'GET',

    path: '/api/wires/reportsinceinvoice/{invoice_uid}/csv',

    config: {

      auth: 'sudopassword',

      handler: handlers.WireReports.showCSV

    }

  });

  server.route({

    method: 'GET',

    path: '/api/ambassadors',

    config: {

      auth: 'sudopassword',

      handler: handlers.Ambassadors.index

    }

  });

  server.route({

    method: 'POST',

    path: '/api/ambassadors',

    config: {

      validate: {
        
        payload : {

          name: Joi.string().required(),

          account_id: Joi.number().required()

        }

      },

      auth: 'sudopassword',

      handler: handlers.Ambassadors.create

    }

  });



  server.route({

    method: 'GET',

    path: '/api/ambassadors/{id}',

    config: {

      auth: 'sudopassword',

      handler: handlers.Ambassadors.show

    }

  });

  server.route({

    method: 'GET',

    path: '/api/merchants/{merchant_id}',

    config: {

      auth: 'sudopassword',

      handler: handlers.Merchants.show

    }

  });

  server.route({

    method: 'GET',

    path: '/api/merchants',

    config: {

      auth: 'sudopassword',

      handler: handlers.Merchants.index

    }

  });

  server.route({

    method: 'POST',

    path: '/api/merchants/{merchant_id}/ambassadors/{ambassador_id}',

    config: {

      auth: 'sudopassword',

      handler: handlers.MerchantAmbassador.create

    }

  });

  server.route({

    method: 'GET',

    path: '/api/kraken_invoice_sell_orders',

    config: {

      auth: 'sudopassword',

      handler: handlers.KrakenInvoiceSellOrders.index

    }

  });

  server.route({

    method: 'GET',

    path: `/api/emails`,

    config: {

      auth: 'sudopassword',

      handler: handlers.Emails.index

    }

  });

  /**
  ** SEQUELIZE AUTO_GENERATED HANDLERS EXPERIMENT
  function sequelizeHandler(handlerType, model) {
 
  };


  Object.keys(models).forEach(modelName => {

    let model = models[modelName];

    let resource_path_base = camelToSnake(modelName);

    server.route({

      method: 'GET',

      path: `/api/sequelze/${resource_path_base}`,

      config: {

        auth: 'sudopassword',

        handler: sequelizeHandler('index', model)

      }

    });

    server.route({

      method: 'GET',

      path: `/api/sequelze/${resource_path_base}/{id}`,

      config: {

        auth: 'sudopassword',

        handler: sequelizeHandler('show', model)

      }

    });

    server.route({

      method: 'POST',

      path: `/api/sequelze/${resource_path_base}`,

      config: {

        auth: 'sudopassword',

        handler: sequelizeHandler('create', model)

      }

    });

    server.route({

      method: 'DELETE',

      path: `/api/sequelze/${resource_path_base}/{id}`,

      config: {

        auth: 'sudopassword',

        handler: sequelizeHandler('delete', model)

      }

    });

  });
  **  END SEQUELIZE AUTO GENERATED HANDLERS EXPERIMENT
  ****/

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

  Server,

  start

}


function camelToSnake(string) {
 return string.replace(/[\w]([A-Z])/g, function(m) {
   return m[0] + "_" + m[1];
 }).toLowerCase();
}
