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

import * as bsv from 'bsv'
export async function generateKeypair() {

  let privateKey = new bsv.PrivateKey()

  let address = privateKey.toAddress()

  return {

    privateKey: privateKey.toWIF(),

    address: address.toString()

  }

}

import * as chai from 'chai'

export { chai }

const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const spies = require('chai-spies');

chai.use(spies);

var spy = chai.spy.sandbox()

export { spy }

const expect = chai.expect

export {
  chance,
  assert,
  uuid,
  expect
}

