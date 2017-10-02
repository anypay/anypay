const amqp = require('amqplib');
const log = require('winston');
const Blockcypher = require('../../lib/blockcypher');

const AMQP_URL          = 'amqp://blockcypher.anypay.global';
const QUEUE             = 'blockcypher:webhooks';
const BITCOIN_QUEUE     = 'blockcypher:bitcoin:webhooks';
const DASH_PAYOUT_QUEUE = 'dash:payouts';

const Invoice = require('../../lib/models/invoice');
const DashPayout = require('../../lib/models/dash_payout');
const Dashcore = require('../../lib/dashcore');

const Slack = require('../../lib/slack/notifier');

function DashPayoutConsumer(channel) {

  return function(message) {
    let payoutId

    try {
      // receive payoutId  on the message queue
      payoutId = parseInt(message.content.toString())
    } catch(error) {
      // invalid message format

      channel.ack(message);
      return;
    }

    log.info("dash:payout:id", payoutId);

    DashPayout.findOne({ where: {
      id: payoutId,
      status: 'unpaid',
      completedAt: {
        $eq: null
      }
    }})
    .then(payout => {
      if (!payout) { 
        log.error('dash:payout:missing', payoutId);
        channel.ack(message);
        return;
      }
      log.info('dash:payout:found', payout.toJSON());
      log.info('dash:sendPayment', payout.address, payout.amount);

      let amount = parseFloat(payout.amount).toFixed(6);

      Dashcore.sendPayment(payout.address, amount).then(paymentHash => {
        if (!paymentHash) {
          log.error('dash:payout', payout);
          channel.nack(message);
          return;
        }
        log.info('dash:payout:hash', paymentHash);
        payout.payment_hash = paymentHash;
        payout.completedAt = new Date();
        payout.status = 'paid';
        payout.save().then(() => {
          log.info("payout:complete")
          channel.ack(message);
        })
      })
      .catch(error => {
        console.log(error);
        log.info('dash:payout:error', error.message);
        channel.nack(message);
        return;
      });
    })
    .catch(error => {

      channel.nack(message); // requeue message
    });
  }
}

function BlockcypherWebhookConsumer(channel) {

  return function(message) {
    let webhook;

    try {
      webhook = JSON.parse(message.content.toString());
    } catch(error) {
      log.error("invalid webhook message format");
      channel.ack(message);
      return;
    }

    if (!webhook.outputs) {
      log.error("no outputs in webhook, invalid format");
      channel.ack(message);
      return
    }

    let outputsProcessed = 0;
    let outputMatched = false;

    webhook.outputs.forEach(output => {
      let address = output.addresses[0];

      Invoice.findOne({ where: {
        address: address,
        status: 'unpaid'
      }}).then(invoice => {
        if (!invoice) {
          outputsProcessed += 1;
          if (outputsProcessed == webhook.outputs.length) {
            channel.ack(message)
          }
        } else {
          if (invoice.amount == output.value / 100000000.00) {
            console.log('invoice amount matches');
            invoice.updateAttributes({
              status: 'paid',
              paidAt: new Date()
            })
            .then(() => {
              outputsProcessed += 1;
              channel.ack(message);
              channel.sendToQueue('invoices:paid', Buffer.from(invoice.uid));
              outputMatched = true;
							Slack.notify(`invoice:paid https://dash.anypay.global/invoices/${invoice.uid}`);
            });
          } else {
            outputsProcessed += 1;
            if (!outputMatched && outputsProcessed === webhook.outputs.length) {
              channel.ack(message);
            }
          }
        }
      });
    });
  }
}

function BitcoinWebhookConsumer(channel) {

  return function(message) {
    let webhook;

    try {
      webhook = JSON.parse(message.content.toString());
    } catch(error) {
      log.error("invalid webhook message format");
      channel.ack(message);
      return;
    }

    if (!webhook.input_address) {
      log.error("no input_address in webhook, invalid format");
      channel.ack(message);
      return
    }

    let address = webhook.input_address;

    Invoice.findOne({ where: {
      address: address,
      status: 'unpaid'
    }}).then(invoice => {
      if (!invoice) {
        channel.ack(message)
      } else {
        if (invoice.amount >= (webhook.value+Blockcypher.FEE) / 100000000.00) {
          console.log('invoice amount matches');
          invoice.updateAttributes({
            status: 'paid',
            paidAt: new Date()
          })
          .then(() => {
            channel.ack(message);
            channel.sendToQueue('invoices:paid', Buffer.from(invoice.uid));
            outputMatched = true;
            Slack.notify(`invoice:paid https://dash.anypay.global/invoices/${invoice.uid}`);
          });
        } else {
          channel.ack(message);
        }
      }
    });
  }
}

amqp.connect(AMQP_URL).then(conn => {

	return conn.createChannel().then(channel => {
		console.log('channel connected');
  
    channel.assertQueue(DASH_PAYOUT_QUEUE, {durable: true}).then(() => {

      let consumer = DashPayoutConsumer(channel);

      channel.consume(DASH_PAYOUT_QUEUE, consumer, {noAck: false});
    });

    channel.assertQueue(BITCOIN_QUEUE, {durable: true}).then(() => {

      let consumer = BitcoinWebhookConsumer(channel);

      channel.consume(BITCOIN_QUEUE, consumer, {noAck: false});
    });

		channel.assertQueue(QUEUE, {durable: true}).then(() => {

      let consumer = BlockcypherWebhookConsumer(channel);

		  channel.consume(QUEUE, consumer, {noAck: false});

		});
	});
});

