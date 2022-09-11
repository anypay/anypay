/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

import { accounts } from '../../lib';

var energyCityAccounts;

export async function start() {

  energyCityAccounts = await getEnergyCityAccounts();

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.Invoice.afterCreate',

    queue: 'invoice_after_create_to_energycity'

  })
  .start(async (channel, msg, json) => {

    log.info(json);

    let isEnergyCityInvoice: boolean = await checkIfIsEnergyCityInvoice(json);

    if (isEnergyCityInvoice) {

      log.info('energycity.invoice.created', msg.content.toString());

      await channel.publish('energycity', 'invoice.created', msg.content);

    }

    channel.ack(msg);

  });

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.AccountTag.afterCreate',

    queue: 'account_tag_after_create_update_energycity'

  })
  .start(async (channel, msg, json) => {

    await updateEnergyCityAccounts();

    await channel.ack(msg);

  });

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.AccountTag.afterDestroy',

    queue: 'account_tag_after_create_update_energycity'

  })
  .start(async (channel, msg, json) => {

    await updateEnergyCityAccounts();

    await channel.ack(msg);

  });

  async function checkIfIsEnergyCityInvoice(invoice: any): Promise<boolean> {

    return energyCityAccounts[invoice.account_id] ? true : false;

  }

}

async function updateEnergyCityAccounts() {

  energyCityAccounts = await getEnergyCityAccounts();

}

async function getEnergyCityAccounts() {

  let taggedAccounts = await accounts.findAllWithTags([
    'energycity'
  ]);

  return taggedAccounts.reduce((map, accountId) => {
    map[accountId] = true;
    return map;
  }, {});

}

process.on('SIGHUP', async function () {
  log.info('energycity.accounts.reloading');
  await updateEnergyCityAccounts();
  log.info('energycity.accounts.reloaded');
});

if (require.main === module) {

  start();

}

