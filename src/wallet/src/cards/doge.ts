
import BitcoreCard, { Utxo, Bitcore } from './_bitcore'

//@ts-ignore
import * as doge from 'bitcore-lib-doge'

const bitcore: Bitcore = doge

export default class DogeCard extends BitcoreCard {

  chain = 'DOGE'

  currency = 'DOGE'

  bitcore = bitcore

  addInputs({tx,utxos}: {tx: doge.Transaction, utxos: Utxo[]}): Promise<doge.Transaction> {

    const inputs = utxos.map((output: any) => {

      const address = new this.bitcore.Script(output.scriptPubKey).toAddress().toString()

      return {
        txId: output.txid,
        txid: output.txid,
        outputIndex: output.vout,
        address,
        script: output.script,
        scriptPubKey: output.scriptPubKey,
        satoshis: output.value
      }

    })

    tx.from(inputs)
    
    return tx

  }

}

