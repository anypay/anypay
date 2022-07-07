
import { getBitcore } from './bitcore' 

import { getTransaction } from './blockchain'

export async function getTxOutputSatoshis(currency: string, txid: string, index: number): Promise<number> {

  const tx = await getTransaction(currency, txid)

  return tx.outputs[index].satoshis

}

export interface FeeResult {
  total_input: number;
  total_output: number;
  network_fee: number;
}

export async function getMiningFee(currency: string, txhex: string): Promise<FeeResult> {

  let bitcore = getBitcore(currency)

  let tx = new bitcore.Transaction(txhex)

  var total_input = 0

  for (let input of tx.inputs) {

    let txid = input.prevTxId.toString('hex')

    let satoshis: number = await getTxOutputSatoshis(currency, txid, input.outputIndex)

    total_input += satoshis

  }

  const total_output = tx.outputs.reduce((sum, output) => sum + output.satoshis, 0)

  const network_fee = total_input - total_output

  return { total_input, total_output, network_fee }

}


