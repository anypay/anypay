require('dotenv').config();
import * as dash from '@dashevo/dashcore-lib';

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

  let address = new dash.Address(paymentOption.address);
  let script = new dash.Script(address);

  let anypayAddress = new dash.Address(process.env.BIP_270_DASH_EXTRA_OUTPUT_ADDRESS);
  let anypayScript = new dash.Script(anypayAddress);

  let request = {
    network:"dash",
    outputs: [{
      address: address.toString(),
      script: script.toString(),
      amount: dashToSatoshis(paymentOption.amount)
    }, {
      script: anypayScript.toString(),
      address: anypayAddress.toString(),
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

function dashToSatoshis(dash): number{
  return dash * 100000000;
}
