
import { log } from './logger';
import { wait } from './amqp';

const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = process.env.MONGODB_URL || 'mongodb://localhost:27017';

// Database Name
const dbName = 'anypay';

var mongodb;

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {

  if (err) {
    throw err;
  }

  log.info('mongodb.connected');

  mongodb = client.db(dbName);

});

async function getMongodb() {

  while (!mongodb) {

    await wait(100);

  }

  return mongodb;

}

export {

  getMongodb

}
