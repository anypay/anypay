let btc = require('bitcore-lib')
let Transaction = btc.Transaction
let Script = btc.Script

export function createOutputTxFromInputTx(inputTx, route, privateKey, fee = .00002 ){

  let utxos = inputTx.outputs.reduce((result, output, index)  => {

    if( output.script.toAddress().toString() == route.input.address ){
        result.push({ "utxo": output, "index": index })
    }

    return result;

  }, [])

  let input = utxos[0].utxo
 
  let index = utxos[0].index

  fee = btcToSatoshis(fee)

  if (input.satoshis < fee) {

     throw(new RangeError(`Fee: ${fee} satoshis is greater than the unspent output: ${input.satoshis} satoshis`));

     return;
  }

  let utxo = {
    "txId": inputTx.hash,
    "outputIndex": index, 
    "satoshis": input.satoshis,
    "address" : input.script.toAddress().toString(), 
    "script": input.script.toHex() 
  }

  console.log(utxo)

  let amountToSpend = input.satoshis - fee 

  console.log(amountToSpend)

  let outputTx = new Transaction()
    .from(utxo)
    .to(route.output.address, amountToSpend )

  outputTx.sign(privateKey)            
        
  return outputTx.toString();

}


function btcToSatoshis(btc){

  return btc*100000000 | 0;

}
