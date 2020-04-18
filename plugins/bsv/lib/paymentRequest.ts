require('dotenv').config();
import * as bitcoin from 'bsv';
import BigNumber from 'bignumber.js';

import {models} from '../../../lib';
import * as moment from 'moment';

interface Output{
  script: string;
  amount: number;
}

interface PaymentRequest{
    network:string;
    outputs :Output[];
    creationTimestamp: number;
    expirationTimestamp: number;
    memo: string;
    paymentUrl:string; 
    merchantData: string;
}

interface PaymentRequestOptions {
  image_url?: string;
  name?: string;
}

export async function generatePaymentRequest(
  invoice: any,
  paymentOption: any,
  opts: PaymentRequestOptions={})
:Promise<PaymentRequest>{

  let account = await models.Account.findOne({ where: { id: invoice.account_id }});

  let address = new bitcoin.Address(paymentOption.address);

  let script = new bitcoin.Script(address);

  let anypayAddress = new bitcoin.Address(process.env.BIP_270_EXTRA_OUTPUT_ADDRESS);
  let anypayScript = new bitcoin.Script(anypayAddress);

  var merchantName = opts.name || account.business_name;
  var avatarUrl = opts.image_url || account.image_url;

  let request = {
    network:"bitcoin-sv",
    outputs: [{
      script: script.toHex(),
      amount: bsvToSatoshis(paymentOption.amount)
    }, {
      script: anypayScript.toHex(),
      amount: 1000
    }],
    creationTimestamp: moment(invoice.createdAt).unix(),
    expirationTimestamp: moment(invoice.expiry).unix(),
    memo: "Bitcoin SV Payment Request by Anypay Inc",
    paymentUrl: `${process.env.API_BASE}/invoices/${invoice.uid}/pay`,
    merchantData: JSON.stringify({
      invoiceUid: invoice.uid,
      merchantName,
      avatarUrl
    })
  }

  console.log(request)

  return request

}

function bsvToSatoshis(bsv): number{
  let amt = new BigNumber(bsv); 
  let scalar = new BigNumber(100000000);

  return amt.times(scalar).toNumber();
}

