let server = require("http").createServer();
const uuid = require("uuid");

import * as Hapi from 'hapi';

import * as Boom from 'boom';

import { join } from 'path';

import { Actor } from 'rabbi';

require('dotenv').config();

const subscriptions = {};

import { log } from '../../lib/logger';

import { listCities } from '../../lib';

import { Subscriptions } from './lib/subscriptions';

let wsSubscriptions = new Subscriptions();  

const PORT = process.env.SOCKET_IO_PORT || 3000;

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

  path: '/locations',

  handler: (request, h) => {

    return [{
    
    }];

  }

})

const AMQP_URL = process.env.AMQP_URL;
if (!AMQP_URL) {
    throw new Error("AMQP_URL environment variable must be set");
}

const Inert = require('inert');

export async function start() {

  await hapiServer.register(Inert);

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

