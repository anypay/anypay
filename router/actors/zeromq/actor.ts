
require('dotenv').config();

var zmq = require('zeromq');
var sock = zmq.socket('sub');

import { log } from '../../lib/logger';

const models = require('../../models');

async function start() {

  sock.connect(process.env.BCH_ZEROMQ_URL)
  sock.subscribe('hashtx');
  sock.subscribe('hashblock');
  sock.subscribe('rawtx');
  sock.subscribe('rawblock');
  log.info(`zero worker connected to BCH`);

  sock.on('message', async function(topic, msg){

    switch(topic.toString()) {

      case 'hashtx':

        let message = msg.toString('hex');

        log.info(`${topic.toString()} | ${message}`);

        let tx = await models.Transaction.create({ hash: message });

        log.info('transaction.created', tx.toJSON());

        break;
      }
  });

}

if (require.main === module) {

  start();

}

export {

  start

}

