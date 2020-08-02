
interface InvoiceURIParams {
  address: string;
  amount: number;
  currency: string;
  image_url?: string;
  business_name?: string;
  invoice_uid?: string;
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
    'RVN': 'ravencoin',
    'BSV': 'bitcoin'
  };

  var protocol = protocols[params.currency] || params.currency.toLowerCase();


  if (params.currency === 'BCH') {

    uri = `${protocol}:?r=https://api.anypayinc.com/r/${params.invoice_uid}`;

  } else if (params.currency === 'BTC') {

    uri = `${protocol}:?r=https://api.anypayinc.com/r/${params.invoice_uid}`;

  } else if (params.currency === 'XRP') {

    uri = `${protocol}:${params.address}&amount=${params.amount}`;

  } else if (params.currency === 'DASH') {

    uri = `${protocol}:${params.address}?amount=${params.amount}&is=1`;

  } else if (params.currency === 'BSV') {

    uri = `${protocol}:${params.address}?sv&amount=${params.amount}`;

    if (params.business_name) {
      uri = `${uri}&label=${params.business_name}`;
    }

    if (params.image_url) {
      uri = `${uri}&avatarUrl=${params.image_url}`;
    }

    return uri;

  } else if (params.currency === 'GOLD') {

    var tokenId = '8e635bcd1b97ad565b2fdf6b642e760762a386fe4df9e4961f2c13629221914f';

    uri = `${params.address}?amount=${params.amount}&label=Anypay-Gold`;

  } else if (params.currency === 'USDH') {

    uri = `${params.address}?amount=${params.amount}&label=Honest-Coin-USDH`;

  } else {

    uri = `${protocol}:${params.address}?amount=${params.amount}`;

  }

  return uri;

}

