/* implements rabbi actor protocol */

require('dotenv').config();

import { models } from '../../lib'

import { firstAddressSetEmail } from '../../lib/email'

import { Actor, log } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.Address.afterCreate',

    queue: 'first_address_set_email',

  })
  .start(async (channel, msg) => {

    let address = JSON.parse(msg.content.toString())

    log.info('rabbi.first_address_set_email', address);

    let addresses = await models.Address.findAll({ where: {

      account_id: address.account_id
    
    }})

    if (addresses.length === 1) {

      let account = await models.Account.findOne({ where: { id: address.account_id }})

      await firstAddressSetEmail(account)
    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

