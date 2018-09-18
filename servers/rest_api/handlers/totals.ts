import * as logger from 'winston';

import {totalMerchants} from '../../../lib/totals';

export async function merchants() {

  try {

    let total = await totalMerchants();

    logger.info('gettotalmerchants', total);

    return {
      total
    };

  } catch(error){ 

    logger.error(error.message);

    throw error;
  }
}

