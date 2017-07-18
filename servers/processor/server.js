const amqp = require('amqplib');
const log = require('winston');

const AMQP_URL          = 'amqp://blockcypher.anypay.global';
const QUEUE             = 'blockcypher:webhooks';
const DASH_PAYOUT_QUEUE = 'dash:payouts';

const Invoice = require('../../lib/models/invoice');
const DashPayout = require('../../lib/models/dash_payout');


function DashPayoutConsumer(channel) {

  return function(message) {

    try {
      // receive payoutId  on the message queue
      let payoutId = parseInt(message.content.toString())
    } catch(error) {
      // invalid message format

      channel.ack(message);
      return;
    }

    DashPayout.findOne({ where: { id: payoutId }})
      .then(payout => {
        if (!payout) { 
          channel.ack(message);
          return;
        }
        if (payout.status === 'unpaid') {
          // send payout to dash address
          // if fails, requeue message (nack)
        } else {
          channel.ack(message);
          return;
        }
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

amqp.connect(AMQP_URL).then(conn => {

	return conn.createChannel().then(channel => {
		console.log('channel connected');
  
    channel.assertQueue(DASH_PAYOUT_QUEUE, {durable: true}).then(() => {

      let consumer = DashPayoutConsumer(channel);

      channel.consume(DASH_PAYOUT_QUEUE, consumer, {noAck: false});
    });


		channel.assertQueue(QUEUE, {durable: true}).then(() => {

      let consumer = BlockcypherWebhookConsumer(channel);

		  channel.consume(QUEUE, consumer, {noAck: false});

		});
	});
});

