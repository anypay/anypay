
import * as Chance from 'chance';
import * as assert from 'assert';
import * as uuid from 'uuid';

const chance = new Chance();

import { accounts } from '../lib';

export async function generateAccount() {
  return accounts.registerAccount(chance.email(), chance.word());
}

export {
  chance,
  assert,
  uuid
}

