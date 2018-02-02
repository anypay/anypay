
const Hapi = require('hapi');
const restPort = process.env.REST_PORT || '12334';
const logger = require('winston');

// Create a server with a host and port
const server = Hapi.server({ 
    host: '0.0.0.0', 
    port: restPort 
});

function handleBlockcypherTx(tx) {
  //logger.info('blockcypher:webhook', tx);

  var outputs = tx.outputs.map(output => {
    return {
      currency: 'DASH',
      amount: parseFloat(output.value) / 100000000,
      address: output.addresses[0],
      hash: tx.hash
    }
  });

  outputs.map(output => {
    logger.info('output', output);
  })
}

// Add the route
server.route({
    method: 'POST',
    path:'/oracles/dash-blockcypher-webhooks', 
    handler: function (request, h) {
        //logger.info('payload', request.payload);

        handleBlockcypherTx(request.payload);

        return 'success';
    }
});

server.route({
    method: 'POST',
    path:'/oracles/dash-blockcypher-webhooks/{address}', 
    handler: function (request, h) {

        handleBlockcypherTx(request.payload);

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

module.exports = server;

