var jayson = require('jayson');
var logger = require('winston');

var blockcypher = require('./blockcypher');
var db = require('./db');

const port = process.env.RPC_PORT || '12333';

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
      var response = await removeaddress(args[0]);
      
      callback(null, response);

    } catch(error) {

      callback(error);
    }

  }
});

server.http().listen(port);

async function addaddress(address) {

  if (!address) {
    throw new Error('address must be provided');
  }

  var webhookId;

  try {

    let result = await level.get(address, {});

    if (webhookId) {

      return { address, webhookId };

    } else {

      webhookId = await blockcypher.createWebhook(address);
    }

  } catch(error) {

    webhookId = await blockcypher.createWebhook(address);
  }

  if (webhookId) {

    await db.put(address, webhookId, {});

    return { address, webhookId };

  } else {

    throw new Error('failed to create webhook');
  }
}

async function removeaddress(address) {

  logger.info('remove address', address);

  var webhookId = await level.get(address);

  logger.info('removeaddress webhookId', webhookId);

  await blockcypher.deleteWebhook(webhookId);

  await level.del(address);

  return { success: true };
}
