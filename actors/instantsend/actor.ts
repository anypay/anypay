var zmq = require('zeromq');
var sock = zmq.socket('sub');

import { log } from '../../lib';
import { emitter } from '../../lib/events';
import { DashInstantsendTransaction } from '../../lib/models';

require('dotenv').config();

async function start() {

  sock.connect(process.env.DASH_ZEROMQ_URL)
  sock.subscribe('hashtxlock');
  log.info(`zero worker connected to DASH`);

  sock.on('message', async function(topic, msg){

    switch(topic.toString()) {

      case 'hashtxlock':

        let hash = msg.toString('hex');

        log.info(`${topic.toString()} | ${msg.toString('hex')}`);

        let record = await DashInstantsendTransaction.create({ hash });

        log.info(record.toJSON());

        emitter.emit("dash.instantsend.hashlock", record);

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
