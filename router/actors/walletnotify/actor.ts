
import {connect} from 'amqplib';

import { Actor } from 'rabbi';

import * as log from 'winston';

require('dotenv').config();

import { forwardPayment } from '../../lib/forwarder';

async function start () { 

  Actor.create({

    exchange: 'bsv.anypayinc.com',

    routingkey: 'walletnotify',

    queue: 'bsv.walletnotify'

  })
  .start(async (channel, msg) => {

    try {

      let txid = msg.content.toString();

      let resp = await forwardPayment(txid);

      console.log('forward payment resp', resp);

    } catch(error) {

      console.error('error forwding payment', error.message);

    }

    channel.ack(msg);


  });

}


if (require.main === module) {

  start();

}

export {

  start

}
