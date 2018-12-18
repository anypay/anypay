import { log, invoices, plugins } from './';

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

