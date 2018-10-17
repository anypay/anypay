import * as assert from 'assert';

import {getPriceOfOneDollarInVES} from '../../lib/prices/ves';

describe("Venezuelan Bolivar Fuerte", () => {

  it("#getPriceOfOneDollarInVES should get the price", async () => {

    let price = await getPriceOfOneDollarInVES();

    console.log('price', price);

  });

});

