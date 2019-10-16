/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import * as generalbytes from '../../lib/generalbytes';
import { awaitChannel } from '../../lib/amqp';

export async function start() {

  Actor.create({

    exchange: 'anypay.generalbytes',

    routingkey: 'importgeneralbytescsv',

    queue: 'generalbytes_import_csv'

  })
  .start(async (channel, msg, json) => {

    log.info('generalbytes_import_csv', msg.content.toString());

    log.info(json);

    var newRecords = [];

    try {

      let csvString = await getCsvString();

      newRecords = await generalbytes.importCSV(csvString);

    } catch(error) {

      log.error(error.message);

      await channel.publish(
        'anypay.generalbytes',
        'error.generalbytes_handle_imported_trigger_import',
        Buffer.from(error.message)
      );

    }

    await channel.publish(
      'anypay.generalbytes',
      'generalbytes_sales.imported',
      Buffer.from(JSON.stringify(newRecords))
    )

    await channel.ack(msg);

  });

  Actor.create({

    exchange: 'anypay.generalbytes',

    routingkey: 'generalbytes_sales.imported',

    queue: 'generalbytes_handle_imported_trigger_import',

    schema: Joi.object() // optional, enforces validity of json schema

  })
  .start(async (channel, msg, json) => {

    log.info(msg.content.toString());

    log.info(json);

    try {

      await channel.publish('anypay.generalbytes', 'importgeneralbytescsv', Buffer.from(''));

    } catch(error) {

      log.error(error.message)
    }

    await channel.ack(msg);

  });

  let channel = await awaitChannel();

  await channel.publish('anypay.generalbytes', 'importgeneralbytescsv', Buffer.from(''));

}

if (require.main === module) {

  start();

}

export async function getCsvString() {

  let csv = await generalbytes.getCSVFromS3();

  return csv;
}

