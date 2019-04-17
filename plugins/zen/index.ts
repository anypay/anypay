require("dotenv").config();

import {generateInvoice} from '../../lib/invoice';

import { I_Address } from '../../types/interfaces';

import * as http from 'superagent'

import {anypay_checkAddressForPayments} from './lib/checkAddressForPayments'

import {statsd} from '../../lib/stats/statsd';

import { log } from '../../lib/logger';

import * as forwards from './lib/forwards';

var WAValidator = require('anypay-wallet-address-validator');

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'ZEN')

  return valid;

}
async function generateInvoiceAddress(settlementAddress: string): Promise<string> {

  let start = new Date().getTime()

  let paymentForward = await forwards.setupPaymentForward(settlementAddress);

  log.info('zen.paymentforward.created', paymentForward.toJSON());

  statsd.timing('ZEN_generateInvoiceAddress', new Date().getTime()-start)

  statsd.increment('ZEN_generateInvoiceAddress')

  return paymentForward.input_address;

}

async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'ZEN');

  statsd.timing('ZEN_createInvoice', new Date().getTime()-start)

  statsd.increment('ZEN_createInvoice')

  return invoice;

}

async function checkAddressForPayments(address:string, currency:string) {

  let start = new Date().getTime()

  let payments = await anypay_checkAddressForPayments(address, 'ZEN') 

  log.info("Payments found to address: ", address, payments)

  statsd.timing('ZEN_checkAddressForPayments', new Date().getTime()-start)

  statsd.increment('ZEN_checkAddressForPayments')

  return(payments)

}

async function createAddressForward(record: I_Address) {

  let url = "https://zen.anypay.global/v1/zen/forwards";

  let resp = await http.post(url).send({

    destination: record.value,

    callback_url: 'https://api.anypay.global/zen/address_forward_callbacks'

  });

  return resp.body.input_address;

}

export async function getNewAddress(record: I_Address) {

  let address = await createAddressForward(record);

  return address;

}




const currency = 'ZEN';

const poll = true;

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  generateInvoiceAddress,

  poll

};



