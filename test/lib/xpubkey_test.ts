import * as assert from 'assert';

import { xpub, models, accounts } from '../../lib';

import { setAddress } from '../../lib/core';
import { generateInvoice } from '../../lib/invoice';

import * as Chance from 'chance';

const chance = new Chance();

describe("Extended Public Key Service", () => {

  /*
  it("#getNextAddress should increment the nonce", async () => {

    let account = await accounts.registerAccount(chance.email(), chance.word());

    let xpubkey = await models.ExtendedPublicKey.create({

      account_id: account.id,

      nonce: 0,

      xpubkey: 'xpub6CwejPWLBbxgg9hhVUA8kT2RL83ARa1kAk3v564a72kPEyu3sX9GtVNn2UgYDu5aX94Xy3V8ZtwrcJ9QiM7ekJHdq5VpLLyMn4Bog9H5aBS',

      currency: 'DASH'

    })

    let address = await xpub.getNextAddress(xpubkey);

    console.log('address', address);

    xpubkey = await models.ExtendedPublicKey.findOne({ where: { id: xpubkey.id }});

    assert.strictEqual(xpubkey.nonce, 1);

    address = await xpub.getNextAddress(xpubkey);

    console.log('address', address);

    assert.strictEqual(xpubkey.nonce, 2);

  });

  it("#setAddress should accept an xpub key", async () => {

    let account = await accounts.create(chance.email(), chance.word());

    let xpubkey = 'xpub6CwejPWLBbxgg9hhVUA8kT2RL83ARa1kAk3v564a72kPEyu3sX9GtVNn2UgYDu5aX94Xy3V8ZtwrcJ9QiM7ekJHdq5VpLLyMn4Bog9H5aBS';

    await setAddress({
      currency: "DASH",
      address: xpubkey,
      account_id: account.id
    });

    await account.reload(); 

    console.log(account.toJSON());

    assert.strictEqual(account.dash_payout_address, xpubkey); 

    let xpubRecord = await models.ExtendedPublicKey.findOne({
      where: {account_id: account.id}
    });

    console.log(xpubRecord.toJSON());

    assert.strictEqual(xpubRecord.xpubkey, xpubkey);
    assert.strictEqual(xpubRecord.nonce, 0);

  });

  describe("Generating DASH Invoice With Xpub Key", () => {

    it("should still forward payments with Blockcypher", async () => {

      let account = await accounts.create(chance.email(), chance.word());

      let xpubkey = 'xpub6CwejPWLBbxgg9hhVUA8kT2RL83ARa1kAk3v564a72kPEyu3sX9GtVNn2UgYDu5aX94Xy3V8ZtwrcJ9QiM7ekJHdq5VpLLyMn4Bog9H5aBS';

      await setAddress({
        currency: "DASH",
        address: xpubkey,
        account_id: account.id
      });

      await account.reload(); 

      let invoice = await generateInvoice(account.id, 1, 'DASH');

      console.log(invoice.toJSON());

      assert(invoice.id > 0);

      
      await setAddress({
        currency: "DASH",
        address: 'Xn2RJMVNhZ19fYuUqVGWoWXryPETRVvAMJ',
        account_id: account.id
      });

      let invoice2 = await generateInvoice(account.id, 1, 'DASH');

      assert(invoice2.id > 0);

    });

  });
*/

});

