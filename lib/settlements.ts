import { plugins } from './plugins';
import { log } from './logger';
import * as invoices from './invoice';

export async function settleInvoice(invoice) {

  let plugin = await plugins.findForCurrency(invoice.output_currency);

  if (typeof plugin['settleInvoice'] === 'function') {

    let payment = await plugin['settleInvoice'](invoice);

    invoice = await invoices.settleInvoice(invoice, payment); 

    return invoice;
    
  } else {

    log.info(`settleInvoice not implemented for ${invoice.output_currency} plugin`);

  }

}

import { join } from 'path';

var settlements: any = require('require-all')({
  dirname: join(__dirname, '../settlements'),
  filter      :  /(.+)\.ts$/,
  map: function(name, path) {
    return name;
  }
});

export { settlements }

