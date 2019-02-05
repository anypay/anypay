require('dotenv').config();

import * as assert from 'assert';
import {prices} from '../../lib';


describe('Prices', () => {

  it("#createConversion should convert from VEF to DASH", async () => {

    let input = {
      currency: 'VEF',
      value: 50000000
    }

    let conversion = await prices.createConversion(input, 'DASH');

    console.log('conversion of 50000000 VEF to DASH', conversion);

    assert(conversion.output.value > 0);

  });

  it("#convert should convert from BTC to BCH", async () => {

    let input = {
      currency: 'BTC',
      value: 0.05
    }

    let output = await prices.convert(input, 'BCH');

    console.log('output of 0.05 BTC to BCH', output);

    assert(output.value > 0);

  });

  it("#convert should convert from USD to XRP", async () => {

    let input = {
      currency: 'USD',
      value: 12
    }

    let output = await prices.convert(input, 'XRP');

    console.log('output of 12 USD to XRP', output);

    assert(output.value > 0);

  });
  
    it("#convert should convert from USD to ZEN", async () => {

    let input = {
      currency: 'USD',
      value: 12
    }

    let output = await prices.convert(input, 'ZEN');

    console.log('output of 12 USD to ZEN', output);

    assert(output.value > 0);

  });

});
