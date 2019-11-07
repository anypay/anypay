
import * as Chance from 'chance';
const chance = new Chance();

import { accounts } from '../lib';

export async function generateAccount() {
  return accounts.registerAccount(chance.email(), chance.word());
}

export {
  chance
}

