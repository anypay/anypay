
import BitcoreCard, { Utxo, Bitcore } from './_bitcore'

//@ts-ignore
import * as ltc from 'litecore-lib'

const bitcore: Bitcore = ltc

export default class LTC_Card extends BitcoreCard {

  chain = 'LTC'

  currency = 'LTC'

  bitcore = bitcore

  addInputs({tx,utxos}: {tx: ltc.Transaction, utxos: Utxo[]}): Promise<ltc.Transaction> {
    
    const inputs = utxos.map((output: any) => {

      return {
        txId: output.txid,
        outputIndex: output.vout,
        address: output.address,
        script: output.redeemScript,
        scriptPubKey: output.scriptPubKey,
        satoshis: output.value
      }
    })

    tx.from(inputs)

    return tx

  }

}

