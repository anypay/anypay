require('dotenv').config();

import * as assert from 'assert';
import { prices } from '../../lib';


describe('Prices', () => {

  it('#setPrice should set a price in the database', async () => {

    await prices.setPrice('USD', 0.0001, 'BTC');

  });

  it("#convert should convert from BTC to BCH", async () => {

    await prices.setPrice('BCH', 10, 'BTC');

    let input = {
      currency: 'BTC',
      value: 0.05
    }

    let output = await prices.convert(input, 'BCH');

    console.log('output of 0.05 BTC to BCH', output);

    assert(output.value > 0);

  });

  it("#convert should convert from USD to XRP", async () => {

    await prices.setPrice('XRP', 0.3, 'BTC');

    let input = {
      currency: 'USD',
      value: 12
    }

    let output = await prices.convert(input, 'XRP');

    console.log('output of 12 USD to XRP', output);

    assert(output.value > 0);

  });
  
  it.skip("#convert should convert from USD to ZEN", async () => {

    await prices.setPrice('ZEN', 0.01, 'BTC');

    let input = {
      currency: 'USD',
      value: 12
    }

    let output = await prices.convert(input, 'ZEN');

    console.log('output of 12 USD to ZEN', output);

    assert(output.value > 0);

  });

});

