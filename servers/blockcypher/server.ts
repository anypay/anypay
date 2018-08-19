const Hapi = require("hapi");
const amqp = require("amqplib");
const log = require("winston");
require('dotenv').config();

const AMQP_URL = process.env.AMQP_URL;
const BITCOIN_QUEUE  = "blockcypher:bitcoin:webhooks";
const LITECOIN_QUEUE = "blockcypher:litecoin:webhooks";
const DOGECOIN_QUEUE = "blockcypher:dogecoin:webhooks";
const DASH_QUEUE     = "blockcypher:dash:webhooks";
const ETHEREUM_QUEUE     = "blockcypher:ethereum:webhooks";

const Boom = require('boom');

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

amqp
  .connect(AMQP_URL)
  .then(async (conn) => {
    log.info("amqp:connected");

    conn.on("error", error => {
      log.error("amqp:connection:error", error);
      process.exit(1);
    });

    conn.on("close", () => {
      log.error("amqp:connection:closed");
      process.exit(1);
    });

    return conn.createChannel().then(async (channel) => {
      log.info("amqp:channel:created");

      channel.on("error", error => {
        log.error("amqp:channel:error", error);
        process.exit(1);
      });

      channel.on("close", () => {
        log.error("amqp:channel:closed");
        process.exit(1);
      });

      server.route({
        method: "POST",
        path: "/bitcoin/webhooks",
        handler: async function(request, h) {
          log.info("bitcoin:blockcypher:callback", request.payload);

          let message = JSON.stringify(request.payload);

          let sent = await channel.sendToQueue(BITCOIN_QUEUE, new Buffer(message));

          if (!sent) {
            log.error("amqp:send:error", message);
            throw Boom.badRequest();
          } else {
            log.info("amqp:sent", message);
            return;
          }
        }
      });

      server.route({
        method: "POST",
        path: "/litecoin/webhooks",
        handler: async function(request, h) {
          log.info("litecoin:blockcypher:callback", request.payload);

          let message = JSON.stringify(request.payload);

          let sent = await channel.sendToQueue(LITECOIN_QUEUE, new Buffer(message));

          if (!sent) {
            log.error("amqp:send:error", message);
            throw Boom.badRequest();
          } else {
            log.info("amqp:sent", message);
            return;
          }
        }
      });

      server.route({
        method: "POST",
        path: "/dogecoin/webhooks",
        handler: async function(request, h) {
          log.info("dogecoin:blockcypher:callback", request.payload);

          let message = JSON.stringify(request.payload);
					var buffer = new Buffer(message);

          let sent = await channel.sendToQueue(DOGECOIN_QUEUE, buffer);
          await channel.publish('blockcypher', 'callback.doge', new Buffer(message));

          if (!sent) {
            log.error("amqp:send:error", message);
            throw Boom.badRequest();
          } else {
            log.info("amqp:sent", message);
            return;
          }
        }
      });

      server.route({
        method: "POST",
        path: "/dash/webhooks",
        handler: async function(request, h) {
          log.info("dash:blockcypher:callback", request.payload);

          let message = JSON.stringify(request.payload);

          let sent = await await channel.sendToQueue(DASH_QUEUE, new Buffer(message));
          await channel.publish('blockcypher', 'callback.dash', new Buffer(message));

          if (!sent) {
            log.error("amqp:send:error", message);
            throw Boom.badRequest();
          } else {
            log.info("amqp:sent", message);
            return;
          }

          return;
        }
      });

      server.route({
        method: "POST",
        path: "/ethereum/webhooks",
        handler: async function(request, h) {
          log.info("ethereum:blockcypher:callback", request.payload);

          let message = JSON.stringify(request.payload);

          let sent = await channel.sendToQueue(ETHEREUM_QUEUE, new Buffer(message));

          if (!sent) {
            log.error("amqp:send:error", message);
            throw Boom.badRequest();

          } else {
            log.info("amqp:sent", message);
            return;
          }
        }
      });

      await channel.assertExchange('blockcypher', 'direct');
      log.info('amqp.exchange.asserted', 'blockcypher');

      await channel.assertQueue(BITCOIN_QUEUE, { durable: true });
      log.info("amqp:bitcoin:queue:asserted", BITCOIN_QUEUE);

      await channel.assertQueue(DASH_QUEUE, { durable: true });
      log.info("amqp:dash:queue:asserted", DASH_QUEUE);

      await channel.assertQueue(LITECOIN_QUEUE, { durable: true });
      log.info("amqp:litecoin:queue:asserted", LITECOIN_QUEUE);

      await channel.assertQueue(DOGECOIN_QUEUE, { durable: true });
      log.info("amqp:dogecoin:queue:asserted", DOGECOIN_QUEUE);

      await channel.assertQueue(ETHEREUM_QUEUE, { durable: true });
      log.info("amqp:ethereum:queue:asserted", ETHEREUM_QUEUE);
      
      try {

        await server.start();
        log.info("server:started", server.info.uri);

      } catch(err) {

        console.error(err.message);
        process.exit(1);
      }

    });
  })
  .catch(log.error);

