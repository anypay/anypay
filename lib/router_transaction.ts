
import * as models from './models';

import { channel, awaitChannel } from './amqp';

/*

  Domain events are published to AMQP exchange `anypay.router`.

  Events:

    RouterTransactionInputSuccess

    RouterTransactionInputFailure

    RouterTransactionOutputSuccess

    RouterTransactionOutputFailure

    RouterTransactionComplete

*/

interface RouterTransaction {

  /* required */
  input_txid: string;

  output_currency: string;

  output_amount: number;

  output_address: string;

  /* optional */
  output_txid?: string;

  input_amount?: string; 

  input_currency?: string; 

  input_address?: string; 

}

async function initializeRouterTransaction(tx: RouterTransaction): Promise<any> {

  let record = models.RouterTransaction.create(tx);

  let channel = await awaitChannel();

  await channel.publish(

    'anypay.router',

    'RouterTransactionInputSuccess',

    new Buffer(JSON.stringify(tx))

  );

  return record;

}

export {

  RouterTransaction,

  initializeRouterTransaction

}
