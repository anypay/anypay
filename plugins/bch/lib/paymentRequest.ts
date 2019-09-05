const bitcore = require('bitcore-lib-cash');
import {models} from '../../../lib';

interface Output{
  address: string;
  amount: number;
}

interface PaymentRequest{
    network:string;
    currency:string;
    requiredFeeRate: number;
    outputs :Output[];
    time: number;
    expires: number;
    memo: string;
    paymentUrl:string; 
    paymentId:string; 

}

export async function generatePaymentRequest(invoiceUid: string):Promise<PaymentRequest>{

  let invoice = await models.Invoice.findOne({ where: {uid: invoiceUid} })

  let request = {
    network:"main",
    currency:"BCH",
    requiredFeeRate:1,
    outputs :[ {address: invoice.address, amount: bchToSatoshis(invoice.amount) }],
    time: Date.now() / 1000 | 0,
    expires: invoice.expiry,
    memo: "Anypay Invoice",
    paymentUrl: `${process.env.API_BASE}/invoices/${invoice.uid}/bip70`,
    paymentId: invoice.uid
  }

  console.log(request)

  return request

}

function bchToSatoshis(bch): number{
  return bch*100000000 | 0;
}
