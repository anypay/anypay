#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { models } from '../lib/models';

import * as http from 'superagent'

import { buildOutputs, buildPaymentRequest, completePayment, fees } from '../lib/pay';

program
  .command('tests <base_url>')
  .action( async (base_url) => {

    try {

      let uid = 'f6eF_inmN'

      let resp = await http
        .get(`${base_url}/r/${uid}`) 
        .set({
          'Accept': 'application/payment-request',
          'x-currency': 'BCH'
        })

      console.log(resp)

      resp = await http
        .get(`${base_url}/r/${uid}`) 
        .set({
          'Accept': 'application/payment-request',
          'x-currency': 'DASH'
        })

      console.log(resp.body)

      resp = await http
        .get(`${base_url}/r/${uid}`) 
        .set({
          'Accept': 'application/payment-request',
          'x-currency': 'BTC'
        })

      console.log(resp.body)

      resp = await http
        .get(`${base_url}/r/${uid}`) 

      console.log(resp.body)

    } catch(error) {

      console.error(error.message)
      

    }

    process.exit(0)

  });

program
  .command('completepayment <invoice_uid> <currency> <txhex>')
  .action(async (invoice_uid, currency, hex) => {

    try {

      let paymentOption = await models.PaymentOption.findOne({ where: { invoice_uid, currency }})

      let payment = await completePayment(paymentOption, hex)

      console.log('payment', payment);

    } catch(error) {

      console.error(error);

    }

    process.exit(0)

  })

program
  .command('getfee <currency>')
  .action(async (currency) => {

    let fee = await fees.getFee(currency);

    console.log(fee);

    process.exit();

  });

program
  .command('submitexample <currency> [isvalid]')
  .action(async (currency, isValid=true) => {

    /*
    let payment = getPayment(currency, isValid)

    try {

      let response = await submitPayment({
        invoice_uid: payment.invoice_uid,
        currency,
        transactions: [payment.transaction]
      });

    } catch(error) {
      console.log(error);
    }

    process.exit(0);
    */

  })


program
  .command('submitpayment <invoice_uid> <currency> <hex>')
  .action(async (invoice_uid, currency, transaction) => {

/*
    try {

      let response = await submitPayment({
        invoice_uid,
        currency,
        transactions: [transaction]
      });

    } catch(error) {

      console.error(error);

    }

    process.exit(0)
    */

  });

program
  .command('buildoutputs <invoice_uid> <currency> <protocol>')
  .action(async (invoice_uid, currency, protocol) => {

    try {

      let payment_option = await models.PaymentOption.findOne({ where: { currency, invoice_uid }});

      let outputs = await buildOutputs(payment_option, protocol);

      console.log(outputs);

    } catch(error) {

      console.error(error);

    }

    process.exit();
  
  });

program
  .command('buildpaymentrequest <invoice_uid> <currency> <protocol>')
  .action(async (invoice_uid, currency, protocol) => {

    try {

      let paymentOption = await models.PaymentOption.findOne({ where: { currency, invoice_uid }});

      let paymentRequest = await buildPaymentRequest(Object.assign(paymentOption, { protocol }));

      console.log(paymentRequest);

    } catch(error) {

      console.error(error);

    }

    process.exit();
  
  });

/*
program
  .command('verify <invoice_uid> <currency> <tx_hex>')
  .action(async (invoice_uid, currency, hex) => {

    try {

      let payment_option = await models.PaymentOption.findOne({ where: { currency, invoice_uid }});

      console.log('PAYMENT OPTION', payment_option.toJSON());

      let outputs = await buildOutputs(payment_option);

      console.log(outputs);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });
*/

program.parse(process.argv);


function getPayment(currency: string, isValid: boolean) {

  const validPayments = {
    'BTC': {
      invoice_uid: '8b3e642a-fbff-443c-8e72-91ea24f896d0',
      transaction: '0200000001ced4222aad5402c5a70b5abfa6ff6cab002fe7684ea0bb2f5644902f868b9b95020000006a473044022004e79209d4aef1e2038e8a392a693d9b8f312dbe7e9ccd569ec61764aa384ef70220283531dd2be88885fe3b3dc0abc09c94af4c474bf34f52a387d3340e557c305e012103ac5af1850c32217aa80a4a2c9ae949a0f1735ae3b3531c709e1eef1f67404474ffffffff03a82f0000000000001976a9148f3a92ec79a22b1b77e6a72afb128c270cb7aa8f88ac88130000000000001976a914452a3c76b5a082f9a19a4eab6ee756ede33d9da388ac12b30000000000001976a9143ae332d9d9fc1c004afe12cc815f4d7778c4dc9c88ac00000000'
    },
    'BCH': {
      invoice_uid: '4402dc4c-56a7-4917-9d11-562b628002ea',
      transaction: '01000000017365e2c43448958a75aaa4a52fd4ece626daacbd1b26e91579e55e00d5c22de0010000006a47304402204d35e49a0a3848ea21baaaf47185f70ba413591efc4aa149bb72e7d53249cbe102200f540a8d748532b9a91faabc49a50342d918630a6e3e366abdbfebeae65005ef4121033d2e87194e1764c071af2cc96062752822f217fe0832a70bade97492dfc4981cffffffff02a82f0000000000001976a914f2b42a684c34ac4d59052a72f96968db175d633888ac4f2a0100000000001976a9140886251e56c1367e00d3e01f48a669b30b4ba30c88ac00000000'
    },
    'DASH': {
      invoice_uid: 'ac2f495f-daa9-41eb-92c6-007cbc0b43ac',
      transaction: '0100000001015ee14584c6a5d1380798f0980a95f6723cda02a3d3141c14aa0365cd801186000000006a473044022033ae4dd214b9884c0e5564e0c5b763e47b70d79e2097d6a7978c20c3e55e86f20220588c75a168850e3ac91d6a3ffa60a0966e430e92705c5a8762d849d81a7da6b0012102c5e284fa27925fbe5892c5539b68c9566174423fa10456a46e9e6c518149bb64ffffffff0388130000000000001976a914e6632c8ec5817c9ad7ef1b5ea30f4cb30d2f693488ac04300300000000001976a914771d5c91a18d7f89735e07e7119566696c15afb288aca7f3b103000000001976a914fea5c06cc0245eda5b42360a41f1029b9dc79c9788ac00000000'
    },
    'BSV': {
      invoice_uid: '5d8b75a3-bdc0-4be9-bacb-4a56b889f36e',
      transaction: '01000000013e386114157b9855adca0cd79bf6138de9cd970015d120f849e2e58d76fff428020000006a47304402203d1c309e7d738c2082c2241e52265a150cfac83196bbc947365c173392886e1e022004a22ec272cc47d15d2c781b719a53ec5393a5439fdbe358de880c8fdd9f724e4121022aa88d68cc74eb0fafd59f2c4c175fe34a3f5dc05bc1971c7de87dde99a862d7ffffffff0488130000000000001976a9143f1723880ec52f7e4b147a0b845a9f8ea27983c188acd8a40000000000001976a91469f9e49c63dba6ad32a93e14edc8d066cbfc66be88ace8030000000000001976a914fde8f61612beecbf7532765d17ce9c36c860187888ac75060000000000001976a914df2ee8aa7424159c8983501c0c749bd97109ed4388ac00000000'
    }
  }

  const invalidPayments = {
    'BCH': {
      invoice_uid: '4bf09fbb-3387-43d2-9346-a956a32fdb8c',
      transaction: '02000000012ca1afe3e3a20dc6da45cbc5236d468dfbb4428716c7debe6a07b83edef126fe010000006b4830450221009b677b107a82517f9df47d9df85188edf2f20d62915caa34791800b198eaa56302205de57bdd3cc17e5707e0d781f456ae7fc00cd689e778147fbb303dd250cd237e412103ca36840980ab83639f95a270e1de83a4b483bf715a5e329437956252e42e5a07ffffffff0368420000000000001976a914f2b42a684c34ac4d59052a72f96968db175d633888ac88130000000000001976a914d08179af82195645af97fdf9576c531b363d809488ac7ac76701000000001976a9140a08dba9029148dd33eeacb79a8158e18382f1bc88ac00000000'
    },
  }
  if (isValid) {
    return validPayments[currency] 
  } else {
    return invalidPayments[currency] 

  }
}

