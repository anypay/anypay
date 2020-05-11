/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';
import { system } from '../../lib/rabbi/system';
import { publishJson } from '../../lib/rabbi';

import { models } from '../../lib/models';

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

    console.log('truereviews.code', trueReviewsCode);

    await publishJson(channel, 'anypay', 'truereviews.token.created', trueReviewsCode)

    let [record, isNew] = await models.TrueReviewsToken.findOrCreate({
      where: {
        invoice_uid: uid
      },
      defaults: {
        invoice_uid: uid,
        origin: trueReviewsCode.origin,
        timestamp: trueReviewsCode.createdAt,
        redeemURL: trueReviewsCode.redeemURL,
        code: trueReviewsCode.code,
        placeID: trueReviewsCode.place.placeID
      }
    })

    if (isNew) {

      console.log('truereviews.code.recorded', record.toJSON());

    } else {

      console.log('truereviews.code.alreadyexists', record.toJSON());
    }
 
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


