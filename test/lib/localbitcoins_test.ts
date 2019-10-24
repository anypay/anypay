import * as assert from 'assert';

import { getTickerAllCurrencies } from '../../lib/localbitcoins';
import { log } from '../../lib/logger';

describe("Local Bitcoins API", () => {

  it.skip('should get the price of all currencies', async () => {

    let currencies = await getTickerAllCurrencies();

    log.info('VES Prices:', currencies['VES']);

    assert(currencies['VES']['avg_12h'] > 0)

  });

});

