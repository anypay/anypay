import {generateInvoice} from '../../lib/invoice';

import * as chainSoAPI from '../../lib/chainSoAPI';

import {Invoice} from '../../types/interfaces';

import {statsd} from '../../lib/stats/statsd'

import {log, xpub, models} from '../../lib'

import * as rpc from './lib/jsonrpc';

import * as Blockcypher from '../../lib/dash/blockcypher';

import { I_Address } from '../../types/interfaces';

export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  log.info('about to generate dash invoice');

  let invoice = await generateInvoice(accountId, amount, 'DASH');

  log.info('generated dash invoice');

  statsd.timing('DASH_createInvoice', new Date().getTime()-start)
  
  statsd.increment('DASH_createInvoice')

  return invoice;

}

export async function getNewAddress(record: I_Address) {

  /* 
   * Example extended public key:
   *
   * xpub6CwejPWLBbxgg9hhVUA8kT2RL83ARa1kAk3v564a72kPEyu3sX9GtVNn2UgYDu5aX94Xy3V8ZtwrcJ9QiM7ekJHdq5VpLLyMn4Bog9H5aBS
   *
   * (stevenzeiler dash android wallet)
   *
   */

  if (record.value.match(/^xpub/)) {

    var address = xpub.generateAddress('DASH', record.value, record.nonce);

    await models.Address.update({

      nonce: record.nonce + 1

    },{

      where: {

        id: record.id

      }
    
    });

  } else {

    let paymentEndpoint = await Blockcypher.createPaymentEndpoint(record.value);

    address = paymentEndpoint.input_address;

  }

  return address;


}

async function checkAddressForPayments(address:string, currency:string){

  log.info(`dash.checkAddressForPayments.${address}`);

  let start = new Date().getTime();

  let payments = await chainSoAPI.checkAddressForPayments(address,currency);

  log.info(`dash.checkAddressForPayments.result`, payments);

  statsd.timing('DASH_checkAddressForPayments', new Date().getTime()-start);

  statsd.increment('DASH_checkAddressForPayments');

  return payments;
}

const currency = 'DASH';

const poll = true;

export {

  currency,

  checkAddressForPayments,

  poll,

  rpc

};
