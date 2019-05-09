
import * as http from 'superagent';

require('dotenv').config();

import { Actor } from 'bunnies';

import { log } from '../../lib';

var Mailchimp = require('mailchimp-api-v3');

const LIST_ID = '7bd4603ab9';

export async function start() {

  let mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

  let actor = Actor.create({

    exchange: 'anypay.events',

    routingkey: 'account.created',

    queue: 'mailchimp.subscribe'

  })

  actor.start(async (channel, msg) => {

    log.info(`actors.mailchimp_registration`, msg.content.toString());

    try {

      let account = JSON.parse(msg.content.toString());

      let resp = await mailchimp.post({
        path: `/lists/${LIST_ID}/members`,
        body: {
          email_address: account.email,
          status: 'subscribed'
        }
      });

      log.info(`mailchimp.subscribed`, account.email);

    } catch(error) {

      log.error(error.message);

    }

    await channel.ack(msg);

  });

  log.info('actors.mailchimp_registration.started');

}

if (require.main === module) {

  start();

}


