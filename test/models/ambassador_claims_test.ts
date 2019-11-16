require('dotenv').config();

import { ambassadors, log, models } from '../../lib';

import * as utils from '../utils';

describe('AmbassadorClaim Model', () => {

  it('#create should default to unverified', async () => {

    try {

      let ambassadorAccount = await utils.generateAccount();

      let ambassador = await models.Ambassador.create({
        account_id: ambassadorAccount.id
      });

      let merchantAccount = await utils.generateAccount();

      let merchant = await models.CashbackMerchant.create({
        account_id: merchantAccount.id
      });

      let claim = await ambassadors.createClaim(ambassadorAccount.email, merchantAccount.email);

      utils.assert(claim.id > 0);

      utils.assert.strictEqual(claim.status, 'unverified');

      utils.assert(claim.ambassador_id, ambassador.id);

      utils.assert(claim.merchant_account_id, merchantAccount.id);

    } catch(error) {

      console.error(error.message);
      utils.assert(false);

    }

  });

  it('#listUnverifiedClaims should list all unverified claims', async () => {

    let claims = await ambassadors.listUnverifiedClaims();

    claims.forEach(claim => {

      utils.assert.strictEqual(claim.status, 'unverified');

    });

  });

  it('#listAccountClaims should list verified, unverified, rejected', async () => {

    let ambassadorEmail = utils.chance.email();
    let merchantEmail = utils.chance.email();

    let ambassadorAccount = await models.Account.create({
      email: ambassadorEmail
    });

    let ambassador = await models.Ambassador.create({
      account_id: ambassadorAccount.id
    });

    let merchantAccount = await models.Account.create({
      email: merchantEmail
    });

    await ambassadors.createClaim(ambassadorEmail, merchantEmail);

    let claims = await ambassadors.listAccountClaims(ambassadorEmail);

    utils.assert(claims.length === 1);

  });

  it('#reject should reject a claim', async () => {

    let ambassadorEmail = utils.chance.email();
    let merchantEmail = utils.chance.email();

    let ambassadorAccount = await utils.generateAccount();

    let ambassador = await models.Ambassador.create({
      account_id: ambassadorAccount.id
    });

    let merchantAccount = await utils.generateAccount();

    let merchant = await models.CashbackMerchant.create({
      account_id: merchantAccount.id
    });

    let claim = await ambassadors.createClaim(ambassadorAccount.email, merchantAccount.email);

    await ambassadors.rejectClaim(claim.id);

    claim = await models.AmbassadorClaim.findOne({ where: { id: claim.id }});

    utils.assert.strictEqual(claim.status, 'rejected');

  });

  it('#verify should accept a claim', async () => {

    let ambassadorAccount = await utils.generateAccount();

    let ambassador = await models.Ambassador.create({
      account_id: ambassadorAccount.id
    });

    let merchantAccount = await utils.generateAccount();

    let claim = await ambassadors.createClaim(ambassadorAccount.email, merchantAccount.email);

    console.log('CLAIM', claim.toJSON());

    await ambassadors.verifyClaim(claim.id);

    claim = await models.AmbassadorClaim.findOne({ where: { id: claim.id }});

    utils.assert.strictEqual(claim.status, 'verified');

  });

});

