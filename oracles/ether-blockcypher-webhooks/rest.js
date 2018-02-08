const Hapi = require('hapi');
const restPort = process.env.REST_PORT || '12334';
const logger = require('winston');
const amqp = require("amqplib");

const AMQP_QUEUE = 'anypay:payments:received';

const AMQP_URL = "amqp://blockcypher.anypay.global";

// Create a server with a host and port
const server = Hapi.server({ 
    host: '0.0.0.0', 
    port: restPort 
});

function handleBlockcypherTx(tx, channel) {
  logger.info('blockcypher:webhook', tx);

  var outputs = tx.outputs.map(output => {
    return {
      currency: 'ETH',
      amount: parseFloat(output.value) / 100000000,
      address: output.addresses[0],
      hash: tx.hash
    }
  });

  outputs.map(payment => {
    logger.info('output', payment);

    let message = JSON.stringify(payment);

    let sent = channel.sendToQueue(AMQP_QUEUE, new Buffer(message));
  })
}

amqp
  .connect(AMQP_URL)
  .then(async (conn) => {

    logger.info("amqp:connected", AMQP_URL);

    conn.on("error", error => {
      logger.error("amqp:connection:error", error);
      process.exit(1);
    });

    conn.on("close", () => {
      logger.error("amqp:connection:closed");
      process.exit(1);
    });

    var channel = await conn.createChannel();

    // Add the route
    server.route({
        method: 'POST',
        path:'/oracles/ether-blockcypher-webhooks',
        handler: function (request, h) {
            //logger.info('payload', request.payload);

            handleBlockcypherTx(request.payload, channel);

            return 'success';
        }
    });

    // Start the server
    async function start() {

        try {
            await server.start();
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }

        console.log('Server running at:', server.info.uri);
    };

    start();

});

module.exports = server;

