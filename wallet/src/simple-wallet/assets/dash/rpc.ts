
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
    this.username = params.username || process.env.DASH_RPC_USER
    this.password = params.password || process.env.DASH_RPC_PASSWORD
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

