require('dotenv').config();

import * as Chance from 'chance';
import * as uuid from 'uuid';

const chance = new Chance();

import * as assert from 'assert';

import { registerAccount } from '../lib/accounts';
import { setAddress } from '../lib/core';

export async function generateAccount() {
  let account = await registerAccount(chance.email(), chance.word());
}

export {
  chance,
  assert,
  uuid
}

