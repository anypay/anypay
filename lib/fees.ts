
import { getBitcore } from './bitcore' 

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

    console.log('INPUT', input)
    //TODO: Get the previous transaction to discover the satoshis contained

    let satoshis: number = tx.outputs[input.outputIndex].satoshis

    total_input += satoshis

  }

  console.log('total input', total_input)

  const total_output = tx.outputs.reduce((sum: number, output: {satoshis: number}) => sum + output.satoshis, 0)

  console.log('total output', total_output)

  const network_fee = total_input - total_output

  return { total_input, total_output, network_fee }

}


