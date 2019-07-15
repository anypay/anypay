let server = require("http").createServer();
const uuid = require("uuid");
import * as amqp from "amqplib";
const QUEUE = process.env.AMQP_QUEUE || 'ws.notify.invoice.paid';

import * as Hapi from 'hapi';

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const subscriptions = {};
const invoices = {};

import { log } from '../../lib';

class InvoiceSubscriptions {

  subscriptions: any = {};

  invoices: any = {};

  subscribeInvoice(client, invoice) {

    this.subscriptions[client.uid] = invoice;

    if (!this.invoices[invoice]) {

      this.invoices[invoice] = [];

    }

    this.invoices[invoice].push(client);
  }

  handleInvoicePaid(invoice) {

    if (this.invoices[invoice]) {

      this.invoices[invoice].forEach(client => {

        client.emit("invoice:paid", invoice);

      });

      setTimeout(function() {

        delete this.invoices[invoice];

      }, 60000); // remove from map in one minute

    }
  }

  handleDashbackPaid(invoice) {

    if (this.invoices[invoice]) {

      this.invoices[invoice].forEach(client => {

        client.emit("dashback.paid", invoice);

      });

    }
  }

  unsubscribeClient(client) {

    let invoice = this.subscriptions[client.uid];

    if (this.invoices[invoice]) {

      this.invoices[invoice] = this.invoices[invoice].filter(c => {

        return c.uid !== client.uid;

      });

    }

    delete this.subscriptions[client.uid];

  }

  getSubscriptions() {

    return this.subscriptions;

  }

  getInvoices() {

    return this.subscriptions;

  }

}

let wsSubscriptions = new InvoiceSubscriptions();  

let hapiServer = new Hapi.Server({
  port: 3000,
  host: '0.0.0.0'
});

const io = require("socket.io")(hapiServer.listener);

io.on("connection", client => {
  client.uid = uuid.v4();
  log.info("websocket client connected", client.uid);

  client.on("subscribe", data => {
    if (data.invoice) {
      wsSubscriptions.subscribeInvoice(client, data.invoice);
      log.info("client subscribed to invoice", client.uid, data.invoice);
    }
  });

  client.on("disconnect", () => {
    let invoice = wsSubscriptions.subscriptions[client.uid];
    wsSubscriptions.unsubscribeClient(client);

    log.info("websocket client disconnected", client.uid);
    log.info("client unsubscribed", client.uid, invoice);
  });
});

/*server.listen(PORT, () => {
  log.info(`Serving Websockets on Port ${PORT}`);
});
*/


hapiServer.route({

  method: 'GET',

  path: '/subscriptions',

  handler: (request, h) => {

    return wsSubscriptions.subscriptions;

  }

})

hapiServer.start();

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

    wsSubscriptions.handleInvoicePaid(message.content.toString());

    channel.ack(message);

  }, {

    noAck: false

  });

  channel.consume('dashback.notifications', message => {

    console.log('dashback.notifications', message.content.toString());

    wsSubscriptions.handleDashbackPaid(message.content.toString());

    channel.ack(message);

  }, {

    noAck: false

  });

})();

