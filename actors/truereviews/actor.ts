/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';
import { system } from '../../lib/rabbi/system';
import { publishJson } from '../../lib/rabbi';

import { generateCodeForInvoice } from '../../lib/truereviews';

export const start = system(() => {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'true_reviews_create_token',

  })
  .start(async (channel, msg) => {

    let uid = msg.content.toString();

    let trueReviewsCode = await generateCodeForInvoice(uid);

    await publishJson(channel, 'anypay', 'truereviews.token.created', trueReviewsCode)
 
    channel.ack(msg);

  });

  Actor.create({

    exchange: 'anypay',

    routingkey: 'truereviews.token.created',

    queue: 'log_true_reviews_create_token_created',

  })
  .start(async (channel, msg, json) => {

    console.log('truereviews.token.created', json);

    channel.ack(msg);

  });

});


