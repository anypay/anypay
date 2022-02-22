require('dotenv').config();

import * as Chance from 'chance';
import * as uuid from 'uuid';

const chance = new Chance();

import * as assert from 'assert';

import { registerAccount } from '../lib/accounts';
import { setAddress } from '../lib/core';

export async function generateAccount() {
  return registerAccount(chance.email(), chance.word());
}
import * as chai from 'chai'

const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const expect = chai.expect

export {
  chance,
  assert,
  uuid,
  expect
}

