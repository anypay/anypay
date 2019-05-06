require('dotenv').config()

import * as Hapi from 'hapi';

import { log, database, models } from '../../lib';

import { validateSudoPassword } from './auth/sudo_admin_password';

import { sendWebhookForInvoice } from '../../lib/webhooks';

import * as cashbackMerchants from './handlers/cashback_merchants';
import * as cashback from './handlers/cashback';
import * as simplewallets from './handlers/simple_wallets';

import * as passwords from './handlers/passwords';

import * as Joi from 'joi';

async function Server() {

  var server = new Hapi.Server({
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 8100,
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

        try{

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

        }catch(err){

          console.log(err)

        }

      }

    }

  });

  server.route({

    method: "POST",

    path: "/api/invoices/{uid}/webhooks",

    config: {

      auth: "sudopassword",

      handler: async (req, h) => {

        let resp = await sendWebhookForInvoice(req.params.uid); 

        return resp.body;

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

    path: "/api/cashback/merchants",

    config: {

      auth: "sudopassword",

      handler: cashbackMerchants.list

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

