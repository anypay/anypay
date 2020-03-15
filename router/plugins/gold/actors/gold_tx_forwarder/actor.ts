/* implements rabbi actor protocol */

require('dotenv').config();

import { ForwarderFactory } from '../../lib/forwarder_factory';

import { Actor, Joi, log } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'anypay.router',

    routingkey: 'transaction.gold',

    queue: 'gold_tx_forwarder',

  })
  .start(async (channel, msg) => {


    let tx = JSON.parse(msg.content.toString())

    if( tx.tokenInfo ){

      if( tx.tokenInfo.tokenIdHex != '8e635bcd1b97ad565b2fdf6b642e760762a386fe4df9e4961f2c13629221914f' || tx.tokenInfo.transactionType != 'SEND'){
        channel.ack(msg);
        return;
      }

      let forwarderFactory = new ForwarderFactory({

        rpc: {

          host: process.env.BCH_RPC_HOST,

          port: process.env.BCH_RPC_PORT,
  
          password: process.env.BCH_RPC_PASSWORD,

          user: process.env.BCH_RPC_USER

        },

        xprivkey: process.env.GOLD_HD_PRIVATE_KEY,

        bchOracleToken: process.env.GOLD_ORACLE_ACCESS_TOKEN,

        amqpChannel: channel
      
      });

        let forwarder = forwarderFactory.newForwarder({ tx: tx });

        await forwarder.getAddressRoute();

        if( forwarder.route ){

          console.log("address route found ", forwarder.route)

          await forwarder.derivePrivateKey();

          console.log("privkey derive", forwarder.privateKey)

          await forwarder.fundSLPAddress()

          console.log('SLP address funded')

          await forwarder.sendGold();

          console.log('Gold sent', forwarder.outputTx)

          await forwarder.publishForwarded();

          console.log('forward published');

        }
    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

