import { plugins } from './plugins';
import { models } from './models';
import { log } from './logger';
import * as invoices from './invoice';

export async function settleInvoice(invoice) {

  if (!invoice.should_settle) {
    throw new Error('invoice should not settle')
  }

  let account = await models.Account.findOne({
    where: { id: invoice.account_id }
  });

  if (!account.settlement_strategy) {
    throw new Error('no settlement strategy');
  }

  let strategy = findByName(account.settlement_strategy);

  console.log("strategy", strategy);

  await strategy.apply(invoice);

}

import { join } from 'path';

var settlements: any = require('require-all')({
  dirname: join(__dirname, '../settlements'),
  filter      :  /(.+)\.ts$/,
  map: function(name, path) {
    return name;
  }
});

export function findByName(name) {
  return settlements[name].index;
}


