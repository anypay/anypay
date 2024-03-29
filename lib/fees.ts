/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================
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


