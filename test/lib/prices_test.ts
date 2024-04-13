require('dotenv').config();

import { prices } from '../../lib';
import { assert } from '../utils'

describe('Prices', () => {

  it('#setPrice should set a price in the database', async () => {

    await prices.setPrice({
      base_currency: 'USD',
      value: 0.0001,
      source: 'testsource',
      currency: 'BTC'
    });

  });


  it("#convert should convert from USD to XRP", async () => {

    await prices.setPrice({
      base_currency: 'USD',
      value: 0.3,
      source: 'testsource',
      currency: 'XRP'
    })

    let input = {
      currency: 'USD',
      value: 12
    }

    let output = await prices.convert(input, 'XRP');

    assert(output.value > 0);

  });
  
});

