let server = require("http").createServer();
const uuid = require("uuid");

import * as Hapi from 'hapi';

import * as Boom from 'boom';

import { join } from 'path';

import { Op } from 'sequelize';

import { Actor } from 'rabbi';

import * as http from 'superagent';

import * as jwt from 'jsonwebtoken';

require('dotenv').config();

const subscriptions = {};

import { log } from '../../lib/logger';

import { listCities } from '../../lib';

import { decodeWebtoken } from '../../lib/webtoken';
import { models } from '../../../lib/models';

import { Subscriptions } from './lib/subscriptions';

import { createPublicInvoice } from '../../../servers/rest_api/handlers/invoices';

let wsSubscriptions = new Subscriptions();  

const Inert = require('inert');

const PORT = process.env.SOCKET_IO_PORT || 3000;

export async function start() {


  let hapiServer = new Hapi.Server({
    port: PORT,
    host: '0.0.0.0',
    routes: {
      cors: true,
      files: {
          relativeTo: join(__dirname, '../../energy-city-app/dist')
      }
    }
  });

  await hapiServer.register(Inert);
  await hapiServer.register(require('hapi-auth-basic'));

  const io = require("socket.io")(hapiServer.listener);

  io.on("connection", client => {

    client.uid = uuid.v4();

    log.info("socket.connected", client.uid);

    client.on("subscribe", data => {
      wsSubscriptions.subscribe(client);
    });

    client.on("unsubscribe", data => {
      wsSubscriptions.unsubscribe(client);
    });

    client.on("disconnect", () => {

      wsSubscriptions.unsubscribeClient(client);

      log.info("socket.disconnected", client.uid);

    });

  });

  hapiServer.route({

    method: 'GET',

    path: '/subscriptions',

    handler: (request, h) => {

      return wsSubscriptions.subscriptions;

    }

  })

  hapiServer.route({

    method: 'GET',

    path: '/api/cities',

    handler: async (request, h) => {

      try {

        let cities = await listCities();

        return { cities }

      } catch(error) {

        return Boom.badRequest(error.message);

      }

    }

  })

  hapiServer.route({

    method: 'GET',

    path: '/auth/moneybutton',

    handler: (request, h) => {
      const uid = uuid.v4();

      const url = `https://www.moneybutton.com/oauth/v1/authorize?`+
            `response_type=code&`+
            `client_id=${process.env.MONEYBUTTON_OAUTH_IDENTIFIER}&`+
            `redirect_uri=${process.env.MONEYBUTTON_OAUTH_REDIRECT_URL}&`+
            `scope=auth.user_identity:read users.profiles:read&`+
            `state=${uid}`

      return h.redirect(url)

    }

  })

  hapiServer.auth.strategy("webtoken", "basic", { validate: async (req, user, pass, h) => {

    console.log('user', user);
    console.log('pass', pass);

    try {

      let profile = await decodeWebtoken(user);

      console.log('profile', profile);

      req.profile = profile;

      return {
        isValid: true,
        credentials: profile
      }

    } catch(error) {

      console.log(error);
      console.log(error.message);

      return {
        isValid: false
      }

    }


  }});

  hapiServer.route({

    method: 'GET',

    path: '/payments',

    options: {
      auth: 'webtoken'
    },

    handler: async (request, h) => {
      console.log("PROFILE", request.profile);

      try {

        let account = await models.EnergyCityAccount.findOne({
          where: {
            moneybutton_id: parseInt(request.profile.id)
          }
        })


        if (!account) {
          throw new Error('energy city account not found')
        }


        let invoices = await models.Invoice.findAll({
          where: {
            energycity_account_id: account.id,
            status: {
              [Op.ne]: 'unpaid'
            }
          },
          include: [{
            model: models.Account,
            as: 'account'
          }, {
            model: models.TrueReviewsToken,
            as: 'true_reviews_token'
          }]
        });

        return { invoices };

      } catch(error) {

        return Boom.badRequest(error.message);

      }

    }

  });

  hapiServer.route({

    method: 'GET',

    path: '/auth/moneybutton/redirect',

    handler: async (request, h) => {

      let query = request.query;

      return h.redirect(`/#/auth/moneybutton/redirect?code=${query.code}&state=${query.state}`)

    }
  });

  hapiServer.route({

    method: 'POST',

    path: '/invoices',

    options: {
      auth: 'webtoken'
    },

    handler: async (request, h) => {

      let profile = request.profile;

      let energycity_account = await models.EnergyCityAccount.findOne({
        where: {
          moneybutton_id: parseInt(request.profile.id)
        }
      })

      let params = Object.assign(request.payload, {
        energycity_account_id: energycity_account.id
      });

      console.log('params', params);

      let invoice = await createPublicInvoice(request.payload.account_id, params);

      return invoice;

    }
  });

  hapiServer.route({

    method: 'GET',

    path: '/businesses/{stub}',

    handler: async (request, h) => {

      let account = await models.Account.findOne({
        where: { stub: request.params.stub }
      });

      if (!account) {
        return Boom.badRequest('no account found');
      }

      return {
        id: account.id,
        business_name: account.business_name,
        physical_address: account.physical_address,
        latitude: account.latitude,
        longitude: account.longitude
      }

    }
  })



  hapiServer.route({

    method: 'POST',

    path: '/auth/moneybutton',

    handler: async (request, h) => {

      const { code, state } = request.payload;
      console.log(request.payload);

      const url = `https://www.moneybutton.com/oauth/v1/token?`+
            `grant_type=authorization_code&`+
            `client_id=${process.env.MONEYBUTTON_OAUTH_IDENTIFIER}&`+
            `code=${code}&`+
            `scope=auth.user_identity:read users.profiles:read`;

      try {

        let resp = await http.post(url)
          .set('Content-type', 'application/x-www-form-urlencoded')
          .send({
            grant_type: 'authorization_code',
            client_id: process.env.MONEYBUTTON_OAUTH_IDENTIFIER,
            code,
            redirect_uri: process.env.MONEYBUTTON_OAUTH_REDIRECT_URL
          });

        console.log(resp.body);

        // save moneybutton auth code in database
        // get a refresh token

        resp = await http.get('https://www.moneybutton.com/api/v1/auth/user_identity')
          .set('Authorization', `Bearer ${resp.body.access_token}`)
        
        await models.EnergyCityAccount.findOrCreate({
          where: {
            moneybutton_id: parseInt(resp.body.data.id)
          },
          defaults: {
            moneybutton_id: parseInt(resp.body.data.id)
          }
        });

        let token = jwt.sign(resp.body.data, process.env.WEBTOKEN_SIGNING_SECRET)

        let decoded =  await decodeWebtoken(token);

        return { response: resp.body, token, decoded }

      } catch(error) {

        console.log(error);

        return Boom.badRequest(error.message)

      }

    }

  })


  const AMQP_URL = process.env.AMQP_URL;
  if (!AMQP_URL) {
      throw new Error("AMQP_URL environment variable must be set");
  }



      hapiServer.route({
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

  await hapiServer.start();

  log.info('websockets.bind.listening', { port: PORT });

  Actor.create({

    exchange: 'energycity',

    routingkey: 'invoice.created',

    queue: 'energycity_ws_notify_invoice_created'

  })
  .start(async (channel, msg, json) => {

    log.info('energycity_ws_notify_invoice_created', json);

    wsSubscriptions.handleInvoiceCreated(json);

    await channel.ack(msg);

  });

  Actor.create({

    exchange: 'energycity',

    routingkey: 'invoice.paid',

    queue: 'energycity_ws_notify_invoice_paid'

  })
  .start(async (channel, msg, json) => {

    wsSubscriptions.handleInvoicePaid(json);

    await channel.ack(msg);

  });


  //hapiServer.start();

}

if (require.main === module) {

  start();

}

