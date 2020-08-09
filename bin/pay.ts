#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { getBitcore } from '../lib/bitcore';
import { models } from '../lib/models';
import { buildOutputs } from '../lib/bip70';
import { generatePaymentRequest } from '../plugins/bsv/lib/paymentRequest';

program
  .command('verify <invoice_uid> <currency> <tx_hex>')
  .action(async (invoice_uid, currency, hex) => {

    try {

      const bitcore = getBitcore(currency)

      let payment_option = await models.PaymentOption.findOne({ where: { invoice_uid, currency }});

      if (!payment_option) {
        throw new Error(`no ${currency} payment option found for invoice ${invoice_uid}`);
      }

      console.log(payment_option.toJSON());

      var tx = new bitcore.Transaction(hex);

      console.log(tx);

      tx.outputs.map(output => {

        console.log(output.toJSON());

      });

      if (currency === 'BSV') {

        let invoice = await models.Invoice.findOne({ where: { uid: invoice_uid }});

        let paymentRequest = await generatePaymentRequest(invoice, payment_option);

        console.log(paymentRequest);

      } else {

        let outputs = buildOutputs(payment_option);

        console.log(outputs);

      }

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program.parse(process.argv);

/* Examples

8b3e642a-fbff-443c-8e72-91ea24f896d0 BTC 0200000001ced4222aad5402c5a70b5abfa6ff6cab002fe7684ea0bb2f5644902f868b9b95020000006a473044022004e79209d4aef1e2038e8a392a693d9b8f312dbe7e9ccd569ec61764aa384ef70220283531dd2be88885fe3b3dc0abc09c94af4c474bf34f52a387d3340e557c305e012103ac5af1850c32217aa80a4a2c9ae949a0f1735ae3b3531c709e1eef1f67404474ffffffff03a82f0000000000001976a9148f3a92ec79a22b1b77e6a72afb128c270cb7aa8f88ac88130000000000001976a914452a3c76b5a082f9a19a4eab6ee756ede33d9da388ac12b30000000000001976a9143ae332d9d9fc1c004afe12cc815f4d7778c4dc9c88ac00000000

4402dc4c-56a7-4917-9d11-562b628002ea BCH 01000000017365e2c43448958a75aaa4a52fd4ece626daacbd1b26e91579e55e00d5c22de0010000006a47304402204d35e49a0a3848ea21baaaf47185f70ba413591efc4aa149bb72e7d53249cbe102200f540a8d748532b9a91faabc49a50342d918630a6e3e366abdbfebeae65005ef4121033d2e87194e1764c071af2cc96062752822f217fe0832a70bade97492dfc4981cffffffff02a82f0000000000001976a914f2b42a684c34ac4d59052a72f96968db175d633888ac4f2a0100000000001976a9140886251e56c1367e00d3e01f48a669b30b4ba30c88ac00000000

ac2f495f-daa9-41eb-92c6-007cbc0b43ac DASH 0100000001015ee14584c6a5d1380798f0980a95f6723cda02a3d3141c14aa0365cd801186000000006a473044022033ae4dd214b9884c0e5564e0c5b763e47b70d79e2097d6a7978c20c3e55e86f20220588c75a168850e3ac91d6a3ffa60a0966e430e92705c5a8762d849d81a7da6b0012102c5e284fa27925fbe5892c5539b68c9566174423fa10456a46e9e6c518149bb64ffffffff0388130000000000001976a914e6632c8ec5817c9ad7ef1b5ea30f4cb30d2f693488ac04300300000000001976a914771d5c91a18d7f89735e07e7119566696c15afb288aca7f3b103000000001976a914fea5c06cc0245eda5b42360a41f1029b9dc79c9788ac00000000

5d8b75a3-bdc0-4be9-bacb-4a56b889f36e BSV 01000000013e386114157b9855adca0cd79bf6138de9cd970015d120f849e2e58d76fff428020000006a47304402203d1c309e7d738c2082c2241e52265a150cfac83196bbc947365c173392886e1e022004a22ec272cc47d15d2c781b719a53ec5393a5439fdbe358de880c8fdd9f724e4121022aa88d68cc74eb0fafd59f2c4c175fe34a3f5dc05bc1971c7de87dde99a862d7ffffffff0488130000000000001976a9143f1723880ec52f7e4b147a0b845a9f8ea27983c188acd8a40000000000001976a91469f9e49c63dba6ad32a93e14edc8d066cbfc66be88ace8030000000000001976a914fde8f61612beecbf7532765d17ce9c36c860187888ac75060000000000001976a914df2ee8aa7424159c8983501c0c749bd97109ed4388ac00000000

*/
