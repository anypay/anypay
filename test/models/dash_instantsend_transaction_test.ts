require('dotenv').config();

import { DashInstantsendTransaction } from '../../lib/models';

import * as assert from 'assert';

describe('DashInstantsendTransaction Model', () => {

  it('should prevent duplicates', async () => {

    let tx = await DashInstantsendTransaction.create({
      hash: ''
    });

    assert(tx.id > 0);
      
    try {

      await DashInstantsendTransaction.create({
        hash: '993802e4cd181a1998f5043ba9647a4f0a0914a12497487337cf106cb873de4c'
      });

    } catch(error) {

      assert(error);
    }

  });

});

