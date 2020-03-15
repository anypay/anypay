/* implements rabbi actor protocol */

require('dotenv').config();

import { ForwarderFactory } from '../../lib/forwarder_factory';

import { Actor, Joi, log } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'anypay.router',

    routingkey: 'transaction.bsv',

    queue: 'bsv_tx_forwarder.production',

    schema: Joi.object().keys({
      hex: Joi.string().required()
    })

  })
  .start(async (channel, msg, json) => {

    log.info(json);

    let forwarderFactory = new ForwarderFactory({

      rpc: {

        host: process.env.BSV_RPC_HOST,

        port: process.env.BSV_RPC_PORT,

        password: process.env.BSV_RPC_PASSWORD,

        user: process.env.BSV_RPC_USER

      },

      xprivkey: process.env.BSV_HD_PRIVATE_KEY,

      bsvOracleToken: process.env.BSV_ORACLE_ACCESS_TOKEN,

      amqpChannel: channel
      
    });

    let forwarder = forwarderFactory.newForwarder({ hex: json.hex });

    console.log(forwarder)

    await forwarder.getAddressRoute();

    console.log("address route found")

    await forwarder.derivePrivateKey();

    console.log("privkey derived")

    await forwarder.buildOutput();

    console.log("output build")

    await forwarder.signOutput();

    console.log("output signed")

    await forwarder.broadcastOutput();

    console.log("output broadcasted")

    await forwarder.publishForwarded();

    console.log("published forwarded");

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

