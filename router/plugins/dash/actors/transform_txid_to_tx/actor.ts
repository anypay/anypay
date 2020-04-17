/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';

import {rpcCall} from '../../lib/jsonrpc';

export async function start() {

  Actor.create({

    exchange: 'dash.anypay.global',

    routingkey: 'walletnotify',

    queue: 'dash.transform.txid.to.tx'

  })
  .start(async (channel, msg) => {

    let tx = await rpcCall('gettransaction', [msg.content.toString()] )

    channel.publish('anypay.router', 'transaction.dash', Buffer.from(JSON.stringify(tx)))
          
    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

