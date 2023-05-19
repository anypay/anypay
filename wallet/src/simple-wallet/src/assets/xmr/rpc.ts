require('dotenv').config()

import axios from 'axios'

import BigNumber from 'bignumber.js'

import { log } from '../../log'

import { v4 as uuid } from 'uuid'

import { wallet_rpc_url } from './'


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

import { Utxo } from '../../wallet'

interface RpcOptions {
  url: string;
  username?: string;
  password?: string;
}

export class RpcClient {

  url: string;
  username: string | undefined;
  password: string | undefined;

  constructor(params: RpcOptions) {

    this.url = params.url
    this.username = params.username
    this.password = params.password
  }

  async getBalance(address): Promise<number> {

    const trace = uuid()

    const method = 'get_balance'

    const params = {
      "account_index":0,
      "address_indices":[0,1]
    }

    log.debug('wallet-bot.simple-wallet.xmr.rpc.getBalance', { url: this.url, method, params, trace })

    let { data } = await axios.post(`${this.url}/json_rpc`, {method , params}, {
      auth: {
        username: 'username',
        password: 'password'
      }
    })

    let balance: number = data.result

    balance = new BigNumber(data.result.balance).dividedBy(1000000000000).toNumber()

    log.info('wallet-bot.simple-wallet.xmr.rpc.getBalance.result', { result: data.result, trace })

    return balance

  }

  async listUnspent(address: string): Promise<Utxo[]> {

    const trace = uuid()

    let method = 'listunspent'

    //let params = [0, 9999999, `["${address}"]`]
    let params = [0, 9999999, [address]]

    log.debug('wallet-bot.simple-wallet.xmr.rpc.listUnspent', { url: this.url, method, params, trace })

    let { data } = await axios.post(this.url, {method,params})
      /*auth: {
        username: config.get('monero_wallet_rpc_username'),
        password: config.get('monero_wallet_rpc_password')
      }
    })*/

    const utxos = data.result

    console.log('RESULT', data)

    log.info('wallet-bot.simple-wallet.xmr.rpc.listUnspent.result', { trace, data })

    return utxos.map(utxo => {
      return Object.assign(utxo, { value: utxo.amount })
    })


  }

  async sendRawTransaction({ tx_as_hex }: { tx_as_hex: string }): Promise<any> {

    const method = 'send_raw_transaction'

    const params = { tx_as_hex }

    const { data } = await axios.post(this.url, params)

    return data

  }

  async submitTransfer({ tx_as_hex }: { tx_as_hex: string }): Promise<any> {

    const method = 'submit_transfer'

    const params = { tx_as_hex }

    if (!wallet_rpc_url) {
      log.error('monerod_rpc_url config value not set')
    }

    const { data } = await axios.post(wallet_rpc_url, params)

    return data

  }

}

export async function listUnspent(address): Promise<Utxo[]> {

  let rpc = new RpcClient({
    url: wallet_rpc_url
  })

  return rpc.listUnspent(address)

}

import { Balance } from '../../wallet'

export async function getBalance(address): Promise<number> {

  let rpc = new RpcClient({
    url: address
  })

  return rpc.getBalance(address)

}
