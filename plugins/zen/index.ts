require("dotenv").config();

import {generateInvoice} from '../../lib/invoice';

import {anypay_checkAddressForPayments} from './lib/checkAddressForPayments'

export async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'ZEN');

  return invoice;

}

export async function checkAddressForPayments(address:string, currency:string) {

  let payments = await anypay_checkAddressForPayments(address, 'ZEN') 


}

