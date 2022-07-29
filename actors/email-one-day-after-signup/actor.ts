/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, email } from 'rabbi';

import { config } from '../../lib/config'

const sender = config.get('EMAIL_SENDER')

export async function start() {

  Actor.create({

    exchange: 'delayed',

    exchangeType: 'x-delayed-message',

    routingkey: 'one_day_after_signup',

    queue: 'email_one_day_after_signup'


  })
  .start(async (channel, msg, json) => {

    // TODO: send one day after sign up email

    await email.sendEmail('one_day_after_signup', json.email, sender, json)

    channel.ack(msg);

  });

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.Account.afterCreate',

    queue: 'create_delay_one_day_after_signup'

  })
  .start(async (channel, msg) => {

    await channel.publish('delayed', 'one_day_after_signup', msg, {
      headers: {
        'x-delay': 1000 * 60 * 60 * 24
      }
    })

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

