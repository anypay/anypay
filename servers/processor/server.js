const amqp = require('amqplib');

const AMQP_URL = 'amqp://blockcypher.anypay.global';
const QUEUE = 'blockcypher:webhooks';
const Invoice = require('../../lib/models/invoice');

amqp.connect(AMQP_URL).then(conn => {

	return conn.createChannel().then(channel => {
		return channel.assertQueue(QUEUE, {durable: true}).then(() => {

		  channel.consume(QUEUE, message => {

		  	let webhook = JSON.parse(message.content.toString());

				let outputsProcessed = 0;
				let outputMatched = false;

				//console.log(webhook);
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
						console.log('invoice found!', output);
						console.log(invoice);	
						console.log('INVOICE AMOUNT', invoice.amount);
						console.log('OUTPUT AMOUNT', output.value / 100000000.00);
						if (invoice.amount == output.value / 100000000.00) {
							console.log('invoice amount matches');
							invoice.updateAttributes({
								status: 'paid'
							})
							.then(() => {
							  outputsProcessed += 1;
								channel.ack(message);
								channel.sendToQueue('invoices:paid', new Buffer(invoice.uid));
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

		  }, {noAck: false});
    });
	});
});

