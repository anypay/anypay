
const Hapi = require("hapi");
const amqp = require("amqplib");

const AMQP_URL = "amqp://blockcypher.anypay.global";
const QUEUE = "blockcypher:webhooks";

const server = new Hapi.Server();

server.connection({ 
    host: '0.0.0.0', 
    port: process.env.PORT || 8000 
});

amqp.connect(AMQP_URL).then(conn => {
	console.log('amqp:connected', AMQP_URL);

	return conn.createChannel().then(channel => {
		console.log('channel:created');

    server.route({
			method: 'POST',
			path:'/blockcypher/webhooks', 
			handler: function (request, reply) {

				let message = JSON.stringify(request.payload);

				channel.sendToQueue(QUEUE, new Buffer(message));

				reply();
			}
		});

		channel.assertQueue(QUEUE, {durable: true}).then(() => {

				server.start((err) => {
						if (err) {
								throw err;
						}
						console.log('Server running at:', server.info.uri);
				});
		});
  });
})
.catch(console.warn);

