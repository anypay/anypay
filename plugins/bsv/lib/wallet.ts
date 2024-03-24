require('dotenv').config()

const bitcore = require('bsv')

import { config } from '../../../lib'
import { listUnspent } from './rpc'

export async function buildPayment(paymentRequest) {

  let privatekey = new bitcore.PrivateKey(config.get('BSV_SIMPLE_WALLET_WIF'))
  let address = new bitcore.PrivateKey(config.get('BSV_SIMPLE_WALLET_ADDRESS'))

  let unspent = await listUnspent(address)

  let tx = new bitcore.Transaction()
    .from(unspent)
    .change(address)

  for (let output of paymentRequest.instructions[0].outputs) {

    let address = bitcore.Address.fromString(output.address)

    let script = bitcore.Script.fromAddress(address)

    tx.addOutput(
      bitcore.Transaction.Output({
        satoshis: output.amount,
        script: script.toHex()
      })
    )

  }

  tx.sign(privatekey)

}

