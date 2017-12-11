const amqp = require("amqplib");
const log = require("winston");
const Blockcypher = require("../../lib/blockcypher");

const AMQP_URL = "amqp://blockcypher.anypay.global";
const QUEUE = "blockcypher:webhooks";
const BITCOIN_QUEUE  = "blockcypher:bitcoin:webhooks";
const LITECOIN_QUEUE = "blockcypher:litecoin:webhooks";
const DASH_QUEUE     = "blockcypher:dash:webhooks";
const DOGECOIN_QUEUE = "blockcypher:dogecoin:webhooks";

const Invoice = require("../../lib/models/invoice");
const Dashcore = require("../../lib/dashcore");

class InvoiceNotFoundError extends Error {}
class InvoiceUnderpaidError extends Error {}
class InvoiceOverPaidError extends Error {}

const Slack = require("../../lib/slack/notifier");

async function findMatchingInvoice(currency, amount, address) {
  if (fee == undefined) {
    fee = 0;
  }

  var invoice = await Invoice.findOne({
    where: {
      currency: currency,
      address: address,
      status: "unpaid"
    }
  })

  if (!invoice ) {
    throw new InvoiceNotFoundError({currency, amount, address});
  }

  if (amount >= invoice.amount) {

    return invoice;

  } else {

    throw new InvoiceUnderpaidError({uid: invoice.uid, currency, amount, address});
  }
}

async function handlePayment(address, amount, currency) {

  return async function(channel) {

    try {

      var invoice = await findMatchingInvoice(currency, amount, address);

      log.info(`required:${invoice.amount} | paid:${paidAmount}`);

      await invoice.updateAttributes({
        status: "paid",
        paidAt: new Date()
      })

      log.info("invoices:paid", invoice.uid);

      await channel.ack(message);

      await channel.sendToQueue("invoices:paid", Buffer.from(invoice.uid));

      Slack.notify(
        `invoice:paid https://pos.anypay.global/invoices/${invoice.uid}`
      );

    } catch(error) {

      log.error(error.message);
      channel.ack(message);
    }
  }
}

async function parseWebhookMessage(message, coin, blockcypherFee) {

    let webhook;

    try {
      webhook = JSON.parse(message.content.toString());
      log.info(`blockcypher:${coin}:webhook`,webhook);
    } catch (error) {
      log.error("invalid webhook message format");
      channel.ack(message);
      return;
    }

    if (!webhook.input_address) {
      log.error("no input_address in webhook, invalid format");
      await channel.ack(message);
      return;
    }

    let address = webhook.input_address;

    var amount = (webhook.value + blockcypherFee) / 100000000.00000;
    
    return { address, amount };
}

function WebhookConsumer(currency, channel) {
  return function(message) {
    var payment = parsePaymentWebhook(message, currency.name, currency.fee);

    handlePayment(payment.address, payment.amount, currency.code)(channel);
  };
}

var currencies = [
  {
    code: 'BTC',
    name: 'bitcoin',
    queue: BITCOIN_QUEUE,
    fee: Blockcypher.BITCOIN_FEE
  },
  {
    code: 'LTC',
    name: 'litecoin',
    queue: LITECOIN_QUEUE,
    fee: Blockcypher.LITECOIN_FEE
  },
  {
    code: 'DOGE',
    name: 'dogecoin',
    queue: DOGECOIN_QUEUE,
    fee: Blockcypher.DOGECOIN_FEE
  },
  {
    code: 'DASH',
    name: 'dash',
    queue: DASH_QUEUE,
    fee: Blockcypher.DASH_FEE
  }
];

amqp.connect(AMQP_URL).then(conn => {
  return conn.createChannel().then(async channel => {
    log.info("amqp:channel:connected");

    currencies.forEach(async (currency) => {

      await channel.assertQueue(currency.queue, { durable: true })
      let consumer = WebhookConsumer(currency, channel);
      channel.consume(currency.queue, consumer, { noAck: false });

    });
  });
});
