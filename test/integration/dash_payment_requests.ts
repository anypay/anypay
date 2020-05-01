import * as assert from 'assert';
import { bip70, database, invoices, accounts } from '../../lib';
import { setAddress } from '../../lib/core';
import { Server } from '../../servers/rest_api/server';
import * as dash from '@dashevo/dashcore-lib';
import * as http from 'superagent';

import * as Chance from 'chance';
const chance = new Chance();

describe('Dash Payment Requests Using BIP70', () => {

  var server, account;

  before(async () => {
    await database.sync();

    server = await Server();
  });

  before(async () => {
    let email = chance.email();
    let password = chance.word();

    // register account
    account = await accounts.registerAccount(email, password);

    // set dash address
    await setAddress({
      account_id: account.id,
      address: 'XjC54tE93QmBMLZGJmSyzxrrFySLp9xxqm',
      currency: 'DASH'
    });

    // create a grab and go item for sale

  });

  describe('Generating a Payment Request for invoice',async  () => {

    it.skip('should receive a protobuf-encoded Payment message', async () => {

      // create an invoice
      // get the Payment Request and validate the outputs match the invoice

      let invoice = await invoices.generateInvoice(account.id, 0.05, 'DASH')
      // $0.05 invoice for DASH

      let url = `https://api.anypayinc.com/r/${invoice.uid}`;

      let response = await http.get(url)
        .set('accept', 'application/dash-paymentrequest')
        .buffer(true)
        .parse(http.parse['application/octet-stream'])

      /*let response = await server.inject({
        method: 'GET',
        headers: {
          'accept': 'application/dash-paymentrequest'
        },
        url: `/r/${invoice.uid}`,
      });
      */

      let buffer = response.body;

      let request = new bip70.PaymentProtocol('DASH')
        .deserialize(buffer, 'PaymentRequest');

      assert(request.currency === 'DASH');

      assert(request.message.serialized_payment_details);

      let details = new bip70.PaymentProtocol('DASH')
        .deserialize(request.message.serialized_payment_details, 'PaymentDetails');

      assert(details.message.outputs.length > 1);
      //assert.strictEqual(details.message.outputs[0].address, invoice.address);

    });

  });

  describe('Generating a Payment Request for Grab & Go Item', async () => {

    it.skip('should receive a protobuf-encoded Payment message', async () => {

      // get a payment request / invoice for grab and go item
      // validate the outputs match the invoice

    });

  });

  describe('Submitting a Payment for a payment request', async () => {

    it.skip('should receive a protobuf-encoded PaymentAck message', async () => {

      // get a payment request / invoice for grab and go item
      // validate the outputs match the invoice
      // construct the Payment from valid utxos belong to private key
      // sumbmit payment to receive PaymentAck
      // validate PaymentAck protobuf message
      // wait for and check that the invoice is marked as paid

    });

    it.skip('should mark the invoice as paid', () => {


    });

  });

});

