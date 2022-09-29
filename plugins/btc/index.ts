require('dotenv').config()
const btc = require('bitcore-lib')

export { btc as bitcore }

import { oneSuccess } from 'promise-one-success'

import { blockchair } from '../../lib'

export async function broadcastTx(rawTx: string) {

  return oneSuccess([
    blockchair.publish('bitcoin', rawTx)
  ])

}

export function transformAddress(address: string) {

  if (address.match(':')) {

    address = address.split(':')[1]

  }

  return address;

}

export function validateAddress(address: string){

  try {

    new btc.Address(address)
  
    return true

  } catch(error) {

    throw new Error('Invalid BTC address. SegWit addresses not supported. Use 1 or 3-style addresses.')

  }

}

export async function getNewAddress(deprecatedParam){

  return deprecatedParam.value;

}

