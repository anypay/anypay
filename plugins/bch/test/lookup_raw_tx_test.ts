require('dotenv').config();

import {lookupHashTx} from '../lib/lookup_hash_tx';

describe("Lookup Hash Tx", () => {

  it ("#lookupHashTx should return a transaction", async () => {

    let hash = '335e99c50d4a53eea1e0685e6c7fdafcc8bf49787e1b92f557ad01afbd97799f';

    let transaction = await lookupHashTx(hash);

    console.log(transaction);

  });

});

