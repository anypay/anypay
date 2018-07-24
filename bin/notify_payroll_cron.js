#!/usr/bin/env node

require("dotenv").config();
var amqp = require('amqplib');

(async function() {

  var conn = await amqp.connect(process.env.AMQP_URL);

  console.log('amqp.connected');

  let chan = await conn.createChannel();

  console.log('amqp.channel.created');

  await chan.assertExchange('anypay.payroll');

  console.log('amqp.exchange.asserted', 'anypay.payroll');

  await chan.publish('anypay.payroll', 'daily', new Buffer(new Date().toString()));

  console.log('amqp.published');

  setTimeout(() => conn.close(), 5000);

})();

