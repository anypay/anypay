let server = require("http").createServer();
const uuid = require("uuid");
import * as amqp from "amqplib";
const QUEUE = process.env.AMQP_QUEUE || 'ws.notify.invoice.paid';

import { Actor } from 'rabbi';

import { models } from '../../lib';

import * as Hapi from 'hapi';

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const subscriptions = {};
const invoices = {};
const websockets = {};

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

abstract class AccountSubscriptions {

  subscriptions: any = {};

  invoices: any = {};

  // override this in subclasses
  abstract messageClient(client: any, event: string, payload: any);

  handleAccountEvent(accountId, event, payload) {

    console.log('handleAccountEvent', {
      accountId, event, payload
    });

    if (this.invoices[accountId]) {

      this.invoices[accountId].forEach(client => {
        console.log(`messaging client for account ${accountId}`);

        this.messageClient(client, event, payload);


      });

    }
  }

  subscribeAccount(client, accountId) {

    this.subscriptions[client.uid] = accountId;

    if (!this.invoices[accountId]) {

      this.invoices[accountId] = [];

    }

    this.invoices[accountId].push(client);
  }

  unsubscribeClient(client) {

    let accountId = this.subscriptions[client.uid];

    if (this.invoices[accountId]) {

      this.invoices[accountId] = this.invoices[accountId].filter(c => {

        return c.uid !== client.uid;

      });

    }

    delete this.subscriptions[client.uid];

  }

  getSubscriptions() {

    return this.subscriptions;

  }

}

class AccountSubscriptionsWebsockets extends AccountSubscriptions {

  messageClient(client: any, event: string, payload: any) {

    console.log(JSON.stringify({ event, payload }))

    if (client.readyState === WebSocket.OPEN) {

      client.send(JSON.stringify({ event, payload }));
    }

  }

}

class AccountSubscriptionsSocketIO extends AccountSubscriptions {

  messageClient(client: any, event: string, payload: any) {

    client.emit('event', { event, payload });

  }
}

let wsSubscriptions = new InvoiceSubscriptions();  
let accountSubscriptionsSocketIO = new AccountSubscriptionsSocketIO();  
let accountSubscriptionsWebsockets = new AccountSubscriptionsWebsockets();  

let hapiServer = new Hapi.Server({
  port: process.env.SOCKETIO_SERVER_PORT || PORT,
  host: '0.0.0.0'
});

let adminServer = new Hapi.Server({
  port: process.env.WEBSOCKET_ADMIN_API_PORT || 5100,
  host: '0.0.0.0'
});

const io = require("socket.io")(hapiServer.listener);

io.on("connection", client => {
  client.uid = uuid.v4();

  websockets[client.uid] = client;

  log.info("websocket client connected", client.uid);

  client.on("subscribe", data => {
    if (data.invoice) {
      wsSubscriptions.subscribeInvoice(client, data.invoice);
      log.info("client subscribed to invoice", client.uid, data.invoice);
    }
  });

  client.on("authenticate", async (data) => {

    let json = JSON.parse(data); 

    let accessToken = await models.AccessToken.findOne({ where: {

      uid: json.params[0]

    }});

    if (accessToken) {

      accountSubscriptionsSocketIO.subscribeAccount(client, accessToken.account_id);

      log.info("subscribed to account", client.uid, accessToken.account_id);

    } else {

      log.error('authentication.failed', json);

    }

  });

  client.on("disconnect", () => {

    delete websockets[client.uid];

    let invoice = wsSubscriptions.subscriptions[client.uid];
    let accountId = accountSubscriptionsSocketIO.subscriptions[client.uid];
    wsSubscriptions.unsubscribeClient(client);
    accountSubscriptionsSocketIO.unsubscribeClient(client);

    log.info("websocket client disconnected", client.uid);
    log.info("client unsubscribed", client.uid, invoice);
  });
});

adminServer.route({

  method: 'GET',

  path: '/websockets',

  handler: (request, h) => {

    return {

      websockets: Object.values(websockets).map((client: any) => {

        return {
          client_uid: client.uid,
          socket_id: client.id,
          client_address: client.handshake.address,
          connected: client.connected,
          disconnected: client.disconnected,
          connected_at: client.handshake.time,
        }
    
      })
    }

  }

})

adminServer.route({

  method: 'GET',

  path: '/subscriptions',

  handler: (request, h) => {

    return wsSubscriptions.subscriptions;

  }

})

adminServer.start();
console.log('Server running on %s', adminServer.info.uri);

hapiServer.start();
console.log('Server running on %s', hapiServer.info.uri);

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

  await channel.assertExchange('anypay.account_events', 'topic');
  await channel.assertExchange('anypay:invoices', 'direct');
  await channel.assertQueue('dashback.notifications');

  await channel.bindQueue(QUEUE, 'anypay:invoices', 'invoice:paid');

  log.info(`bound queue ${QUEUE} to exchange anypay:invoices, invoice:paid`);

  Actor.create({
    exchange: 'anypay:invoices'
  })
  .start()

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

  Actor.create({

    exchange: 'anypay.account_events',

    routingkey: 'accounts.*.#',

    queue: 'account_events_to_websockets'

  })
  .start(async (channel, msg, json) => {

    let routingKeys = msg.fields.routingKey.split('.');

    let id = routingKeys[1];
    let event = routingKeys.slice(2, routingKeys.length).join('.');

    let account = await models.Account.findOne({ where: { id }});

    if (!account) { return channel.ack(msg) }

    accountSubscriptionsSocketIO.handleAccountEvent(id, event, json);
    accountSubscriptionsWebsockets.handleAccountEvent(id, event, json);

    await channel.ack(msg);

  });

})();

const WebSocket = require('ws');

const wss = new WebSocket.Server({
  host: '0.0.0.0',
  port: process.env.WEBSOCKET_PORT || 3000
});

wss.on('connection', function connection(ws) {

  ws.on('message', async function incoming(message) {

    console.log('received: %s', message);

    try {

      let json = JSON.parse(message);

      console.log(json);

      switch(json.method) {

        case 'authenticate': {
          console.log('ws.raw.authenticate');

          try {

            let accessToken = await models.AccessToken.findOne({ where: {
              uid: json.params[0]
            }});

            if (!accessToken) {

              log.error('authentication.failed', json);
            }

            accountSubscriptionsWebsockets.subscribeAccount(ws, accessToken.account_id);

          } catch(error) {

            console.log(error);
          }

          break;

        }

        default: {

          console.log(json);

          break;
        }

      }

    } catch(error) {

      console.error(error.message);

    }

  });

  ws.on('close', function close() {

    console.log('disconnected');

  });

});

