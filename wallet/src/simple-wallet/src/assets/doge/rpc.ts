

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
  username?: string;
  password?: string;
}

export class RpcClient {

  url: string;
  username: string;
  password: string

  constructor(params: RpcOptions) {

    this.url = params.url
    this.username = params.username || process.env.DOGE_RPC_USER
    this.password = params.password || process.env.DOGE_RPC_PASSWORD
  }

  async listUnspent(address: string): Promise<UTXO[]> {

    let method = 'listunspent'

    let params = [0, 9999999, [`${address}`]]

    let response = await axios.post(this.url, {method, params}, {

      auth: {
        username: this.username,
        password: this.password
      }

    })

    return response.data.result

  }

}

export async function listUnspent(address): Promise<UTXO[]> {

  let rpc = new RpcClient({
    url: process.env.DOGE_RPC_URL
  })

  return rpc.listUnspent(address)

}


import { Balance } from '../../wallet'

import { getBalance as blockchair_getBalance } from '../../../../blockchair'

export async function getBalance(address): Promise<Balance> {

  return blockchair_getBalance('DOGE', address)

}


