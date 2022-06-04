
import { getBitcore } from './bitcore' 

import { getTransaction } from './blockchain'

export async function getTxOutputSatoshis(currency: string, txid: string, index: number): Promise<number> {

  let { vout } = await getTransaction(currency, txid)

  return parseInt(vout[index].valueSat)

}

export interface FeeResult {
  input: number;
  output: number;
  fee: number;
}

export async function getMiningFee(currency: string, txhex: string): Promise<FeeResult> {

  let bitcore = getBitcore(currency)

  let tx = new bitcore.Transaction(txhex)

  var totalInput = 0

  for (let input of tx.inputs) {
    let txid = input.prevTxId.toString('hex')

    let result = await getTransaction(currency, txid)

    let satoshis: number = await getTxOutputSatoshis(currency, txid, input.outputIndex)

    totalInput += satoshis

  }

  var totalOutput = tx.outputs.reduce((sum, output) => sum + output.satoshis, 0)

  const fee = totalInput - totalOutput

  return { input: totalInput, output: totalOutput, fee }

}


