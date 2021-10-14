
require('dotenv').config()

import * as Hapi from 'hapi';

import { log, database, models, password } from '../../lib';

import { logError } from '../../lib/logger'

import { validateSudoPassword } from './auth/sudo_admin_password';

import * as Boom from 'boom';

import { requireHandlersDirectory } from '../../lib/rabbi_hapi';

import { join } from 'path';

const handlers = requireHandlersDirectory(join(__dirname, 'handlers'))

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

      handler: handlers.SudoAddresses.index

    }

  });

  server.route({

    method: 'POST',

    path: '/api/accounts/{account_id}/addresses/{currency}/locks',

    config: {

      auth: 'sudopassword',

      handler: handlers.SudoAddresses.lockAddress

    }

  });

  server.route({

    method: 'DELETE',

    path: '/api/accounts/{account_id}/addresses/{currency}/locks',

    config: {

      auth: 'sudopassword',

      handler: handlers.SudoAddresses.unlockAddress

    }

  });

  server.route({

    method: 'GET',

    path: '/api/payments',

    config: {

      auth: 'sudopassword',

      handler: handlers.Payments.index

    }

  });

  server.route({

    method: 'POST',

    path: '/api/invoices/{uid}/payments',

    config: {

      auth: 'sudopassword',

      handler: handlers.Payments.create

    }

  });

  server.route({

    method: 'GET',

    path: '/api/payments/stats',

    config: {

      handler: handlers.Payments.stats

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

           image_url: Joi.string().optional(),

           website_url: Joi.string().optional()

         }

      }

    }

  });

  server.route({

    method: 'GET',

    path: '/api/auth',

    config: {

      auth: 'sudopassword',

      handler: handlers.SudoLogin.sudoLogin

    }

  });

  server.route({
    method: 'GET',

    path: '/api/search',

    config: {

      auth: "sudopassword",

      handler: handlers.Search.show

    }
  })

  server.route({

    method: 'POST',

    path: '/api/search',

    config: {

      auth: "sudopassword",

      handler: handlers.Search.show

    }
  })

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

      handler: handlers.Webhooks.create

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

    path: "/api/accounts/{id}/invoices",

    config: {

      auth: "sudopassword",

      handler: handlers.AccountInvoices.show

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

    method: 'PUT',

    path: "/api/accounts/{account_id}/passwords",

    config: {

      auth: "sudopassword",

      handler: handlers.Passwords.update,

      validate: {

        payload: {

          password: Joi.string(),

          password_confirmation: Joi.string()

        }

      }

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

    path: '/api/ambassadors',

    config: {

      auth: 'sudopassword',

      handler: handlers.Ambassadors.index

    }

  });

  server.route({

    method: 'GET',

    path: '/api/ambassador_rewards',

    config: {

      auth: 'sudopassword',

      handler: handlers.AmbassadorRewards.index

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

  return server;

}



async function start() {

 try {

    var server = await Server();

    // Start the server
    await server.start();

    log.info(`Server running at ${server.info.uri}`);

  } catch(err) {

    logError('server.error', err)

  }

}

if (require.main === module) {

  start()

}

export {

  Server,

  start

}

