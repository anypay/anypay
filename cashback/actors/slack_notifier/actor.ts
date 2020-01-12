require('dotenv').config();

import * as amqp from 'amqplib';

import { Actor } from 'rabbi';

import {Channel} from 'amqplib';

import {publishSlackMessage} from '../../lib/slack_notifier';

import {notifyDashBackBalance} from '../../lib/balance_notifier';

export async function start(channel?: Channel) {

  Actor.create({

    exchange: 'anypay.cashback',

    routingkey: 'cashback.sent',

    queue: 'slack_notify_cashback_paid'

  }).start(async function(channel, message) {

    try {

      console.log(message.content.toString());

      await publishSlackMessage(message.content.toString());

      await notifyDashBackBalance();

    } catch(error) {

      console.error(error.message);

      await channel.publish('anypay.cashback', 'error', Buffer.from(error.message));
      await channel.publish('anypay.cashback', 'error', Buffer.from(error.toString()));

    }

    channel.ack(message);

  });
}

if (require.main === module) {

  start();
}

