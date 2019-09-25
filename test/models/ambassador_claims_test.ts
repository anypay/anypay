require('dotenv').config();

import * as assert from 'assert';
import * as Chance from 'chance';
import { ambassadors, log, models } from '../../lib';

const chance = new Chance();

describe('AmbassadorClaim Model', () => {

  it('#create should default to unverified', async () => {

    let ambassadorEmail = chance.email();
    let merchantEmail = chance.email();

    let ambassadorAccount = await models.Account.create({
      email: ambassadorEmail
    });

    let ambassador = await models.Ambassador.create({
      account_id: ambassadorAccount.id
    });

    let merchantAccount = await models.Account.create({
      email: merchantEmail
    });

    let merchant = await models.CashbackMerchant.create({
      account_id: merchantAccount.id
    });

    let claim = await ambassadors.createClaim(ambassadorEmail, merchantEmail);

    assert(claim.id > 0);

    assert.strictEqual(claim.status, 'unverified');

    assert(claim.ambassador_id, ambassador.id);

    assert(claim.merchant_id, merchant.id);

  });

  it('#listUnverifiedClaims should list all unverified claims', async () => {

    let claims = await ambassadors.listUnverifiedClaims();

    claims.forEach(claim => {

      assert.strictEqual(claim.status, 'unverified');

    });

  });

  it('#listAccountClaims should list verified, unverified, rejected', async () => {

    let ambassadorEmail = chance.email();
    let merchantEmail = chance.email();

    let ambassadorAccount = await models.Account.create({
      email: ambassadorEmail
    });

    let ambassador = await models.Ambassador.create({
      account_id: ambassadorAccount.id
    });

    let merchantAccount = await models.Account.create({
      email: merchantEmail
    });

    let merchant = await models.CashbackMerchant.create({
      account_id: merchantAccount.id
    });

    await ambassadors.createClaim(ambassadorEmail, merchantEmail);

    let claims = await ambassadors.listAccountClaims(ambassadorEmail);

    assert(claims.length === 1);

  });

  it('#reject should reject a claim', async () => {

    let ambassadorEmail = chance.email();
    let merchantEmail = chance.email();

    let ambassadorAccount = await models.Account.create({
      email: ambassadorEmail
    });

    let ambassador = await models.Ambassador.create({
      account_id: ambassadorAccount.id
    });

    let merchantAccount = await models.Account.create({
      email: merchantEmail
    });

    let merchant = await models.CashbackMerchant.create({
      account_id: merchantAccount.id
    });

    let claim = await ambassadors.createClaim(ambassadorEmail, merchantEmail);

    await ambassadors.rejectClaim(claim.id);

    claim = await models.AmbassadorClaim.findOne({ where: { id: claim.id }});

    assert.strictEqual(claim.status, 'rejected');

  });

  it('#verify should accept a claim', async () => {

    let ambassadorEmail = chance.email();
    let merchantEmail = chance.email();

    let ambassadorAccount = await models.Account.create({
      email: ambassadorEmail
    });

    let ambassador = await models.Ambassador.create({
      account_id: ambassadorAccount.id
    });

    let merchantAccount = await models.Account.create({
      email: merchantEmail
    });

    let merchant = await models.CashbackMerchant.create({
      account_id: merchantAccount.id
    });

    let claim = await ambassadors.createClaim(ambassadorEmail, merchantEmail);

    await ambassadors.verifyClaim(claim.id);

    claim = await models.AmbassadorClaim.findOne({ where: { id: claim.id }});

    assert.strictEqual(claim.status, 'verified');

  });

});

