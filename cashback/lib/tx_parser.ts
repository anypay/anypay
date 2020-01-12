
import * as bch from './bch/tx_parser';
import * as dash from './dash/tx_parser';

var txParsers = {
  'BCH': bch,
  'DASH': dash
};

function getTxParser(currency: string) {

  if (!txParsers[currency]) {

    let parser = require(`./${currency.toLowerCase()}/tx_parser`);

    if (parser) {
      txParsers[currency] = parser;
    } else {
      throw new Error(`no tx parser for currency ${currency}`);
    }

    return txParsers[currency]
  }

}

export async function getChangeAddressFromInvoice(invoice): Promise<string> {

  let txParser = txParsers[invoice.currency];

  return txParser.getChangeAddressFromInvoice(invoice);

}

