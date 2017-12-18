const amqp = require("amqplib");
const log = require("winston");
const Blockcypher = require("../../../lib/blockcypher");
const Invoice = require("../../../lib/models/invoice");
const Slack = require("../../../lib/slack/notifier");

const AMQP_URL = "amqp://blockcypher.anypay.global";
const PAYMENT_QUEUE  = "anypay:payments:received";

class InvoiceNotFoundError extends Error {}

async function findMatchingInvoice(currency, amount, address) {
  log.info('find matching currency', {
    currency, amount, address
  });

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

function handlePayment(address, amount, currency) {

  return async function(channel, message) {

    try {

      var invoice = await findMatchingInvoice(currency, amount, address);

      log.info(`required:${invoice.amount} | paid:${amount}`);

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
      log.error(error);
      channel.ack(message);
    }
  }
}

function PaymentConsumer(channel) {
  return async function(message) {

    var payment = JSON.parse(message.content.toString());

    log.info("PAYMENT", payment);

    handlePayment(payment.address, payment.amount, payment.currency)(channel, message);
  };
}

amqp.connect(AMQP_URL).then(conn => {
  return conn.createChannel().then(async channel => {
    log.info("amqp:channel:connected");

    await channel.assertQueue(PAYMENT_QUEUE, { durable: true })

    let consumer = PaymentConsumer(channel);

    channel.consume(PAYMENT_QUEUE, consumer, { noAck: false });

  });
});
