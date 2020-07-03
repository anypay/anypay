
import { rpc } from '../../plugins/dash/lib/jsonrpc';
import * as PaymentProtocol from '../../vendor/bitcore-payment-protocol';

const axios = require('axios');

import * as dash from '@dashevo/dashcore-lib';

export class Bip70DashPayer {
  invoice_uid: string;
  payment_request: any;
  payment_request_url: any;
  unspent_coins: any[];
  transaction: any;
  payment: any;
  payment_url: string;


  constructor(invoice_uid) {
    this.invoice_uid = invoice_uid;

    if (process.env.NODE_ENV === 'development') {

      this.payment_request_url = `http://localhost:8000/r/${this.invoice_uid}`

    } else {

      this.payment_request_url = `https://api.anypayinc.com/r/${this.invoice_uid}`

    }

  }

  async fetchPaymentRequest() {

    this.payment_request = await getPaymentRequest(this.payment_request_url);

    return this.payment_request;
  }

  async fetchUnspentCoins() {

    let unspent = await rpc.call('listunspent', [0, 100000000, [process.env.DASH_BIP70_PAYER_ADDRESS]])

    this.unspent_coins = unspent.result;

    return unspent

  }

  buildTransaction() {

    let utxos, address, amount, changeAddress, privatekey;

    let addr = this.payment_request.PaymentDetails.outputs[0];

    console.log('ADDRESS', addr);
    console.log('AMOUNT', addr.amount.toNumber());

    var transaction = new dash.Transaction()
    .from(this.unspent_coins)          // Feed information about what unspent outputs one can use
    .to(addr.script, addr.amount.toNumber())  // Add an output with the given amount of satoshis
    //.change(process.env.DASH_BIP70_PAYER_ADDRESS)      // Sets up a change address where the rest of the funds will go
    //.sign(privatekey)

    // set transaction
    this.transaction = transaction;

    return transaction;

  }

  buildPaymentMessage() {

    // set payment

    this.payment = constructPayment(this.payment_request, this.transaction.toHex());

    return this.payment;

  }

  publishPaymentMessage() {

    return postPayment(this.payment, this.payment_url)

  }

}

async function getPaymentRequest(url: string) {
  console.log(url);

  let accept = 'application/dash-paymentrequest'

  let response = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      'accept': accept
    }
  })

  console.log(response)

  let PaymentRequest = PaymentProtocol.PaymentRequest.decode(response.data);

  let PaymentDetails = PaymentProtocol.PaymentDetails.decode(PaymentRequest.serialized_payment_details);

  return {
    PaymentRequest,
    PaymentDetails
  }

}

function constructPayment(paymentRequest: any, hex: string) {

  let payment = new PaymentProtocol.Payment();

  var output = new PaymentProtocol.Output();
  const script =dash.Script.buildPublicKeyHashOut('Xwh247FF6SWymYLiJsMjM1BfrqVkzya6wh')

  payment.set('merchant_data', paymentRequest.merchant_data);
  payment.set('transactions', [hex]);
  payment.set('refund_to', [output]);

  return payment;

}

async function postPayment(payment: any, url: string) {

  let accept = 'application/dash-paymentack'
  let contentType = 'application/dash-payment'

  let response = await axios.post(url, {
    responseType: 'arraybuffer',
    headers: {
      'accept': accept,
      'content-type': contentType
    }
  })

  let PaymentAck = PaymentProtocol.PaymentACK.decode(response.data);

  return { PaymentAck }

}
