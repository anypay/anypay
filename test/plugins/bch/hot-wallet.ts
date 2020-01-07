require('dotenv').config();

import * as wallet from '../../../plugins/bch/wallet';
import * as assert from 'assert';
import * as Chance from 'chance';

import * as bch from '../../../plugins/bch';

const chance = new Chance();

describe('BCH hot wallet test', () => {

  it("Should send transaction", async () => {

    let txid = await wallet.sendtoaddress(["bitcoincash:qpppe9kujfssu7gaqc4w0yrcxvr0hm47sg72mdld2l", 0.00005217 ])

    assert(txid.length == 64);

  });

  it("Should send multi ouput transaction", async () => {

    let txid = await wallet.sendtomany([["bitcoincash:qpppe9kujfssu7gaqc4w0yrcxvr0hm47sg72mdld2l",  0.00005217], ["bitcoincash:qqpk7s09ga6k9ey2ap84zgw2za3htnnqxsz2nl8apn",  0.00005217], ["bitcoincash:qzmfxckkvkewgmxkthupvml4jjmy92eflstwhrn06h", 0.00005217]])

    assert(txid.length == 64);

  });

 it("Should get the hot wallet balance", async () => {

    let balance = await wallet.getbalance()

    assert(balance > 0);

  });

 it("Should return hot wallet address", async () => {

    let address = await wallet.getaddress()

    assert(bch.validateAddress(address));

  });

 it("Should return listunspent utxos", async () => {

    let utxos = await wallet.listunspent();

    assert(utxos.length > 0);

  });

});
