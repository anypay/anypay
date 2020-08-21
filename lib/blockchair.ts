import * as http from 'superagent'
import { log } from './logger'

export async function publishBTC(hex) {

  try {

    let resp = await http.post(`https://api.blockchair.com/bitcoin/push/transaction`).send({
      data: hex
    });

    log.info('blockchair.push.transcation.btc', resp);

    return resp.body.data.transaction_hash;

  } catch(error) {

    log.error('blockchair.push.transaction.btc.error', error);

    throw error;

  }

}

