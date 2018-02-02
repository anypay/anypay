let level = require('level');
let jayson = require('jayson');
let logger = require('winston');
let hapi = require('hapi');
let uuid = require('uuid');

const dbPath = process.env.DB_PATH ||
  '/var/anypay/oracles/dash-blockcypher-webhook.db';

const amqpUrl = process.env.AMQP_URL ||
  'amqp://guest:guest@blockcypher.anypay.global:5672/';

const rpcPort = process.env.RPC_PORT || '12333';
const restPort = process.env.REST_PORT || '12334';

let db = (function(path) {

  return level(path);

})(dbPath);

async function addaddress(address) {

  if (!address) {
    throw new Error('address must be provided');
  }

  var webhookId;

  try {

    error, result = await level.get(address, {});
    console.log("get response", error);
    console.log("get response", result);

    console.log('result of level.get(address)', webhookId)

    if (!webhookId) {
      webhookId = uuid.v4();
      // TODO create blockcypher webhook
    }

  } catch(error) {

    console.log('caught error')

    webhookId = uuid.v4();
    // TODO create blockcypher webhook here
  }

  var error, result = await db.put(address, webhookId, {});
  console.log('db.put result', result);
  console.log('db.put error', error);

  return { address, webhookId };
}

async function removeaddress(address) {

  // TODO delete blockcypher webhook

  await level.del(address);
}

let rpcServer = (function(port) {

  var server = jayson.server({

    addaddress: async function(args, callback) {
      logger.info('addaddress', args);

      try {
        var response = await addaddress(args[0]);

        logger.info('response', response);
        
        callback(null, response);

      } catch(error) {
        logger.error(error.message);

        callback(error);
      }
    },

    removeaddress: async function(args, callback) {

      try {
        var response = await removeaddress(args.address);
        
        callback(null, response);

      } catch(error) {

        callback(error);
      }

    }
  });

  server.http().listen(port);

})(rpcPort);

let restServer = (function(port) {

})(restPort);

