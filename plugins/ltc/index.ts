
import * as blockchair from '../../lib/blockchair'

const ltc = require('litecore-lib');

export { ltc as bitcore }

export const currency = 'LTC'

export async function getNewAddress(record) {
  return record.value;
}

export async function broadcastTx(rawTx: string) {

  return blockchair.publish('litecoin', rawTx)

}

