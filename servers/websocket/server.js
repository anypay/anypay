const server = require("http").createServer();
const uuid = require("uuid");
const amqp = require("amqplib");
const QUEUE = process.env.AMQP_QUEUE || 'ws.notify.invoice.paid';

require('dotenv').config();

const io = require("socket.io")(server);

const PORT = process.env.PORT || 3000;

const subscriptions = {};
const invoices = {};

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
    delete invoices[invoice];
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
  console.log("client connected", client.uid);

  client.on("subscribe", data => {
    if (data.invoice) {
      subscribeInvoice(client, data.invoice);
      console.log("client subscripted to invoice", client.uid, data.invoice);
    }
  });

  client.on("disconnect", () => {
    let invoice = subscriptions[client.uid];
    unsubscribeClient(client);

    console.log("client disconnected", client.uid);
    console.log("client unsubscribed", client.uid, invoice);
  });
});

server.listen(PORT, () => {
  console.log(`Serving Websockets on Port ${PORT}`);
});

const AMQP_URL = process.env.AMQP_URL;
if (!AMQP_URL) {
    throw new Error("AMQP_URL environment variable must be set");
}

amqp.connect(AMQP_URL).then(conn => {
  console.log("amqp:connected", AMQP_URL);

  return conn.createChannel().then(channel => {
    console.log("channel:created");

    channel.assertQueue(QUEUE).then(() => {
      channel.consume(
        QUEUE,
        message => {
          console.log('message', message.content.toString());
          handleInvoicePaid(message.content.toString());
          channel.ack(message);
        },
        { noAck: false }
      );
    });
  });
});
