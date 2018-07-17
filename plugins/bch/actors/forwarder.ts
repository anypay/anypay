const JsonRpc = require('../lib/jsonrpc');
const Hapi = require('hapi');

const amqp     = require('amqplib');
const AMQP_URL = 'amqp://blockcypher.anypay.global';
const AMQP_QUEUE = 'anypay:payment:received';

const SEND_BITCOIN_CASH_QUEUE = 'bitcoincash:payment:send';

const redis = require("redis");
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1'
});

let rpc = new JsonRpc(); 

(async function() {

  var amqpConn = await amqp.connect(AMQP_URL);
  var amqpChannel = await amqpConn.createChannel();

  amqpChannel.consume(AMQP_QUEUE, async function(message) {

    try {
      var payment = JSON.parse(message.content.toString());

      if (payment.amount <= 0) {
        await amqpChannel.ack(message);
        return;
      }

      console.log('PAYMENT', payment);

      var destination = await redisClient.getAsync(payment.address);

      if (destination) {

        console.log("destination found", destination);

        let json = JSON.stringify({
          address: destination,
          amount: payment.amount
        });

        var isPaid = await redisClient.getAsync(payment.hash);

        console.log("IS PAID", isPaid);

        if (!isPaid) {
          await redisClient.setAsync(payment.hash, true);
          await amqpChannel.sendToQueue(SEND_BITCOIN_CASH_QUEUE, new Buffer(json));
        }
        await amqpChannel.ack(message);

      } else {
        await amqpChannel.ack(message);
      }

    } catch(err) {
      console.log('error parsing', err);
      await amqpChannel.nack(message);
    }

  });
})();

(async function() {

  var amqpConn = await amqp.connect(AMQP_URL);
  var amqpChannel = await amqpConn.createChannel();

  await amqpChannel.assertQueue(SEND_BITCOIN_CASH_QUEUE);

  amqpChannel.consume(SEND_BITCOIN_CASH_QUEUE, async function(message) {

    try {
      var payment = JSON.parse(message.content.toString());

      var res = await rpc.call('sendtoaddress', [payment.address, payment.amount.toString()]);

      console.log(res);

      await amqpChannel.ack(message);
    } catch(err) {
      console.error('error sending payment', err);
      await amqpChannel.nack(message);
    }

  });
})()

