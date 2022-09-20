
import * as blockchair from '../../lib/blockchair';

var WAValidator = require('anypay-wallet-address-validator');

const doge = require('bitcore-doge-lib');

export { doge as bitcore }

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'DOGE')

  return valid;

}

export async function getNewAddress(record) {
  return record.value;
}

export async function broadcastTx(rawTx: string) {

  return blockchair.publish('dogecoin', rawTx)

}

const currency = 'DOGE';

export {

  currency

}

