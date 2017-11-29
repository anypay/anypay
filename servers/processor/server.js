const amqp = require("amqplib");
const log = require("winston");
const Blockcypher = require("../../lib/blockcypher");

const AMQP_URL = "amqp://blockcypher.anypay.global";
const QUEUE = "blockcypher:webhooks";
const BITCOIN_QUEUE = "blockcypher:bitcoin:webhooks";
const LITECOIN_QUEUE = "blockcypher:litecoin:webhooks";
const DASH_QUEUE = "blockcypher:dash:webhooks";

const Invoice = require("../../lib/models/invoice");
const Dashcore = require("../../lib/dashcore");

const Slack = require("../../lib/slack/notifier");

function BitcoinWebhookConsumer(channel) {
  return function(message) {
    let webhook;

    try {
      webhook = JSON.parse(message.content.toString());
      log.info('blockcypher:bitcoin:webhook',webhook);
    } catch (error) {
      log.error("invalid webhook message format");
      channel.ack(message);
      return;
    }

    if (!webhook.input_address) {
      log.error("no input_address in webhook, invalid format");
      channel.ack(message);
      return;
    }

    let address = webhook.input_address;

    Invoice.findOne({
      where: {
        address: address,
        status: "unpaid"
      }
    }).then(invoice => {
      if (!invoice) {
        channel.ack(message);
      } else {

        let paidAmount = (webhook.value + Blockcypher.BITCOIN_FEE) / 100000000.00000;

        log.info(`required:${invoice.amount} | paid:${paidAmount}`);

        if (paidAmount >= invoice.amount) {

          invoice
            .updateAttributes({
              status: "paid",
              paidAt: new Date()
            })
            .then(() => {
              channel.ack(message);
              log.info("invoices:paid", invoice.uid);
              channel.sendToQueue("invoices:paid", Buffer.from(invoice.uid));
              outputMatched = true;
              Slack.notify(
                `invoice:paid https://pos.anypay.global/invoices/${invoice.uid}`
              );
            });
        } else {
          channel.ack(message);
        }
      }
    });
  };
}

function LitecoinWebhookConsumer(channel) {
  return function(message) {
    let webhook;

    try {
      webhook = JSON.parse(message.content.toString());
      log.info('blockcypher:litecoin:webhook',webhook);
    } catch (error) {
      log.error("invalid webhook message format");
      channel.ack(message);
      return;
    }

    if (!webhook.input_address) {
      log.error("no input_address in webhook, invalid format");
      channel.ack(message);
      return;
    }

    let address = webhook.input_address;

    Invoice.findOne({
      where: {
        address: address,
        status: "unpaid"
      }
    }).then(invoice => {
      if (!invoice) {
        channel.ack(message);
      } else {

        let paidAmount = (webhook.value + Blockcypher.LITECOIN_FEE) / 100000000.00000;

        log.info(`required:${invoice.amount} | paid:${paidAmount}`);

        if (paidAmount >= invoice.amount) {

          invoice
            .updateAttributes({
              status: "paid",
              paidAt: new Date()
            })
            .then(() => {
              channel.ack(message);
              log.info("invoices:paid", invoice.uid);
              channel.sendToQueue("invoices:paid", Buffer.from(invoice.uid));
              outputMatched = true;
              Slack.notify(
                `invoice:paid https://pos.anypay.global/invoices/${invoice.uid}`
              );
            });
        } else {
          channel.ack(message);
        }
      }
    });
  };
}

function DashWebhookConsumer(channel) {
  return function(message) {
    let webhook;

    try {
      webhook = JSON.parse(message.content.toString());
      log.info('blockcypher:dash:webhook',webhook);
    } catch (error) {
      log.error("invalid webhook message format");
      channel.ack(message);
      return;
    }

    if (!webhook.input_address) {
      log.error("no input_address in webhook, invalid format");
      channel.ack(message);
      return;
    }

    let address = webhook.input_address;

    Invoice.findOne({
      where: {
        address: address,
        status: "unpaid"
      }
    }).then(invoice => {
      if (!invoice) {
        channel.ack(message);
      } else {

        let paidAmount = (webhook.value + Blockcypher.DASH_FEE) / 100000000.00000;
        log.info(`paid:${paidAmount} | required:${invoice.amount}`);

        if (paidAmount >= invoice.amount) {

          return invoice
            .updateAttributes({
              status: "paid",
              paidAt: new Date()
            })
            .then(() => {
              channel.ack(message);
              log.info("invoices:paid", invoice.uid);
              channel.sendToQueue("invoices:paid", Buffer.from(invoice.uid));
              outputMatched = true;
              Slack.notify(
                `invoice:paid https://pos.anypay.global/invoices/${invoice.uid}`
              );
            });
        } else {
          channel.ack(message);
        }
      }
    })
    .catch(error => {
      channel.nack(message);
    });
  };
}

amqp.connect(AMQP_URL).then(conn => {
  return conn.createChannel().then(channel => {
    log.info("amqp:channel:connected");

    channel.assertQueue(DASH_QUEUE, { durable: true }).then(() => {
      let consumer = DashWebhookConsumer(channel);

      channel.consume(DASH_QUEUE, consumer, { noAck: false });
    });

    channel.assertQueue(BITCOIN_QUEUE, { durable: true }).then(() => {
      let consumer = BitcoinWebhookConsumer(channel);

      channel.consume(BITCOIN_QUEUE, consumer, { noAck: false });

    });

    channel.assertQueue(LITECOIN_QUEUE, { durable: true }).then(() => {
      let consumer = LitecoinWebhookConsumer(channel);

      channel.consume(LITECOIN_QUEUE, consumer, { noAck: false });
    });
  });
});
