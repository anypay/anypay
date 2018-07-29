import * as Hapi from 'hapi';
import {parse} from 'url';
import {Invoice} from '../../../lib/models';

async function lookupInvoiceByURI(invoiceURI: string) {

  let url = parse(invoiceURI);

  var invoice = await Invoice.findOne({ where: {
    
    address: url.hostname

  }});

  if (!invoice) {

    invoice = await Invoice.findOne({ where: {
      
      address: `${url.protocol}${url.hostname}`

    }});

  }

  return invoice;
}

export async function createLinks(req: Hapi.Request, h: Hapi.ResponseToolkit) {

  let invoice = await lookupInvoiceByURI(req.payload.invoice_uri);

  if (!invoice) {

    throw new Error(`invoice not found for URI ${req.payload.invoice_Uri}`);

  }

  return {

    links: [

      invoice

    ]

  }

}
