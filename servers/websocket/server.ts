let server = require("http").createServer();
const uuid = require("uuid");
import * as amqp from "amqplib";
const QUEUE = process.env.AMQP_QUEUE || 'ws.notify.invoice.paid';

require('dotenv').config();

const io = require("socket.io")(server);

const PORT = process.env.PORT || 3000;

const subscriptions = {};
const invoices = {};

import { log } from '../../lib';

function subscribeInvoice(client, invoice) {
  subscriptions[client.uid] = invoice;
  if (!invoices[invoice]) {
    invoices[invoice] = [];
  }
  invoices[invoice].push(client);
}

function handleInvoicePaid(invoice) {
  if (invoices[invoice]) {
    invoices[invoice].forEach(client => {
      client.emit("invoice:paid", invoice);
    });

    setTimeout(function() {
      delete invoices[invoice];
    }, 60000); // remove from map in one minute
  }
}

function handleDashbackPaid(invoice) {
  if (invoices[invoice]) {
    invoices[invoice].forEach(client => {
      client.emit("dashback.paid", invoice);
    });
  }
}

function unsubscribeClient(client) {
  let invoice = subscriptions[client.uid];

  if (invoices[invoice]) {
    invoices[invoice] = invoices[invoice].filter(c => {
      return c.uid !== client.uid;
    });
  }
  delete subscriptions[client.uid];
}

io.on("connection", client => {
  client.uid = uuid.v4();
  log.info("websocket client connected", client.uid);

  client.on("subscribe", data => {
    if (data.invoice) {
      subscribeInvoice(client, data.invoice);
      log.info("client subscripted to invoice", client.uid, data.invoice);
    }
  });

  client.on("disconnect", () => {
    let invoice = subscriptions[client.uid];
    unsubscribeClient(client);

    log.info("websocket client disconnected", client.uid);
    log.info("client unsubscribed", client.uid, invoice);
  });
});

server.listen(PORT, () => {
  log.info(`Serving Websockets on Port ${PORT}`);
});

const AMQP_URL = process.env.AMQP_URL;
if (!AMQP_URL) {
    throw new Error("AMQP_URL environment variable must be set");
}

(async function() {

  let conn = await amqp.connect(AMQP_URL);

  log.info("websockets.amqp.connected");

  let channel = await conn.createChannel();

  log.info("channel:created");

  await channel.assertQueue(QUEUE);

  await channel.assertQueue('dashback.notifications');

  await channel.bindQueue(QUEUE, 'anypay:invoices', 'invoice:paid');

  log.info(`bound queue ${QUEUE} to exchange anypay:invoices, invoice:paid`);

  channel.consume(QUEUE, message => {

    log.info('message', message.content.toString());

    handleInvoicePaid(message.content.toString());

    channel.ack(message);

  }, {

    noAck: false

  });

  channel.consume('dashback.notifications', message => {

    console.log('dashback.notifications', message.content.toString());

    handleDashbackPaid(message.content.toString());

    channel.ack(message);

  }, {

    noAck: false

  });

})();

