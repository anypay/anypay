
import axios from 'axios'

export interface UTXO {
  txid: string;
  vout: number;
  address: string;
  account: string;
  scriptPubKey: string;
  amount: number;
  confirmations: number;
  spendable: boolean;
  solvable: boolean;
  safe: boolean;
}

interface RpcOptions {
  url: string;
}

export class RpcClient {

  url: string;

  constructor(params: RpcOptions) {

    this.url = params.url
  }

  async listUnspent(address: string): Promise<UTXO[]> {

    let method = 'listunspent'

    //let params = [0, 9999999, `["${address}"]`]
    let params = [0, 9999999, [address]]

    let { data } = await axios.post(this.url, {method,params}, {
      auth: {
        username: process.env.BSV_RPC_USER,
        password: process.env.BSV_RPC_PASSWORD
      }
    })

    return data.result

  }

}

import { getBalance as blockchair_getBalance, listUnspent as blockchair_listUnspent, BlockchairUtxo } from '../../../../blockchair'

import { run, RunUtxo } from '../../run'

export async function listUnspent(address): Promise<Utxo[]> {

  const utxos: RunUtxo[]  = await run.blockchain.utxos(address)

  return utxos.map(utxo => {
    return {
      txid: utxo.txid,
      vout: utxo.vout,
      value: utxo.satoshis,
      scriptPubKey: utxo.script
    }
  })

}

import { Utxo } from '../../wallet'

export async function getBalance(address): Promise<number> {

  const utxos: Utxo[] = await listUnspent(address)

  return utxos.reduce((sum, {value}) => sum + value, 0)

}