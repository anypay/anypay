require('dotenv').config();
import * as bitcoin from 'bsv';
import BigNumber from 'bignumber.js';

import {models} from '../../../lib';

interface Output{
  script: string;
  amount: number;
}

interface PaymentRequest{
    network:string;
    outputs :Output[];
    time: number;
    creationTimestamp: Date;
    expirationTimestamp: Date;
    memo: string;
    paymentUrl:string; 

}

export async function generatePaymentRequest(invoice: any, paymentOption: any):Promise<PaymentRequest>{
  console.log('invoice', invoice);
  console.log('invoice', invoice);

  let address = new bitcoin.Address(paymentOption.address);

  let script = new bitcoin.Script(address);

  let anypayAddress = new bitcoin.Address(process.env.BIP_270_EXTRA_OUTPUT_ADDRESS);
  let anypayScript = new bitcoin.Script(anypayAddress);

  let request = {
    network:"bitcoin-sv",
    outputs: [{
      script: script.toHex(),
      amount: bsvToSatoshis(paymentOption.amount)
    }, {
      script: anypayScript.toHex(),
      amount: 1000
    }],
    time: Date.now() / 1000 | 0,
    creationTimestamp: invoice.createdAt,
    expirationTimestamp: invoice.expiry,
    memo: "Energy City Invoice",
    paymentUrl: `${process.env.API_BASE}/invoices/${invoice.uid}/pay`,
  }

  console.log(request)

  return request

}

function bsvToSatoshis(bsv): number{
  let amt = new BigNumber(bsv); 
  let scalar = new BigNumber(100000000);

  return amt.times(scalar).toNumber();
}

