
interface InvoiceURIParams {
  currency: string;
  uid: string;
}

import { getBaseURL } from './pay/environment';

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
  'BSV': 'pay'
};

export function computeInvoiceURI(params: InvoiceURIParams) {

  const protocol = protocols[params.currency] || 'pay';

  const baseUrl = getBaseURL();

  const uri = `${protocol}:?r=${baseUrl}/r/${params.uid}`;

  return uri;

}

