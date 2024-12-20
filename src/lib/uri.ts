/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

interface InvoiceURIParams {
  currency: string;
  uid: string;
}

import { getBaseURL } from './pay/environment';


const protocols: { [key: string]: string } = {
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
export function computeInvoiceURI(params: InvoiceURIParams): string {


  const protocol = protocols[params.currency] || 'pay';

  const baseUrl = getBaseURL();

  const uri = `${protocol}:?r=${baseUrl}/r/${params.uid}`;

  return uri;

}

