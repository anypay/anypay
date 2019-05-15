
interface InvoiceURIParams {
  address: string;
  amount: number;
  currency: string;
}

export function computeInvoiceURI(params: InvoiceURIParams) {

  var uri;

  const protocols = {
    'DASH': 'dash',
    'ZEC': 'zcash',
    'BTC': 'bitcoin',
    'LTC': 'litecoin',
    'ETH': 'ethereum',
    'XMR': 'monero',
    'DOGE': 'dogecoin',
    'BCH': 'bitcoincash',
    'XRP': 'ripple',
    'ZEN': 'horizen',
    'SMART': 'smartcash',
    'RVN': 'ravencoin'
  };

  var protocol = protocols[params.currency] || params.currency.toLowerCase();

  if (params.currency === 'BCH') {

    uri = `${params.address}?amount=${params.amount}`;

  } else if (params.currency === 'XRP') {

    uri = `${protocol}:${params.address}&amount=${params.amount}`;

  } else if (params.currency === 'DASH') {

    uri = `${protocol}:${params.address}?amount=${params.amount}&is=1`;

  } else {

    uri = `${protocol}:${params.address}?amount=${params.amount}`;

  }

  uri = `${uri}&any=1`;

  return uri;

}

