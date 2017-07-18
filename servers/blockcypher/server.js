const Hapi = require("hapi");
const amqp = require("amqplib");
const log = require("winston");

const AMQP_URL = "amqp://blockcypher.anypay.global";
const QUEUE = "blockcypher:webhooks";

const server = new Hapi.Server();

server.connection({ 
    host: '0.0.0.0', 
    port: process.env.PORT || 8000 
});

amqp.connect(AMQP_URL).then(conn => {

	log.info('amqp:connected', AMQP_URL);

  conn.on("error", error => {
    log.error('amqp:connection:error', error);
    process.exit(1);
  });

  conn.on("close", () => {
    log.error('amqp:connection:closed');
    process.exit(1);
  });

	return conn.createChannel().then(channel => {
		log.info('amqp:channel:created');

    channel.on("error", error => {
      log.error('amqp:channel:error', error);
      process.exit(1);
    });

    channel.on("close", () => {
      log.error('amqp:channel:closed');
      process.exit(1);
    });

    server.route({
			method: 'POST',
			path:'/blockcypher/webhooks', 
			handler: function (request, reply) {

        log.info("blockcypher:callback", request.payload);

				let message = JSON.stringify(request.payload);

				let sent = channel.sendToQueue(QUEUE, new Buffer(message));

        if (!sent) {
          log.error('amqp:send:error', message);
          reply().code(500);
        } else {
          log.info('amqp:sent', message);
          reply();
        }
			}
		});

		channel.assertQueue(QUEUE, {durable: true}).then(() => {
        log.info('amqp:queue:asserted', QUEUE);

				server.start((err) => {
						if (err) {
								throw err;
						}
						log.info('server:started', server.info.uri);
				});
		});
  });
})
.catch(log.error);

