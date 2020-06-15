/* implements rabbi actor protocol */

require('dotenv').config();

import { ForwarderFactory } from '../../lib/forwarder_factory';

import { Actor, Joi, log } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'anypay.router',

    routingkey: 'transaction.usdh',

    queue: 'usdh_tx_forwarder',

  })
  .start(async (channel, msg) => {


    let tx = JSON.parse(msg.content.toString())

    if( tx.tokenInfo ){

      if( tx.tokenInfo.tokenIdHex != 'c4b0d62156b3fa5c8f3436079b5394f7edc1bef5dc1cd2f9d0c4d46f82cca479' || tx.tokenInfo.transactionType != 'SEND'){
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

        xprivkey: process.env.USDH_HD_PRIVATE_KEY,

        bchOracleToken: process.env.USDH_ORACLE_ACCESS_TOKEN,

        amqpChannel: channel
      
      });

        let forwarder = forwarderFactory.newForwarder({ tx: tx });

        await forwarder.getAddressRoute();

        if( forwarder.route ){

          try {

            console.log("address route found ", forwarder.route)

            await forwarder.derivePrivateKey();

            console.log("privkey derive", forwarder.privateKey)

            await forwarder.fundSLPAddress()

            console.log('SLP address funded')

            await forwarder.sendUSDH();

            console.log('USDH sent', forwarder.outputTx)

            await forwarder.publishForwarded();

            console.log('forward published');

          } catch(error) {

            console.log('error forwarding', error); 

          }

        }
    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

