/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';

import {rpcCall} from '../../lib/jsonrpc';

export async function start() {

  Actor.create({

    exchange: 'bch.anypay.global',

    routingkey: 'walletnotify',

    queue: 'bch.transform.txid.to.tx'

  })
  .start(async (channel, msg) => {

    let tx = await rpcCall('gettransaction', [msg.content.toString()] )

    console.log(tx)

    channel.publish('anypay.router', 'transaction.bch', Buffer.from(JSON.stringify(tx)))
          
    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}
