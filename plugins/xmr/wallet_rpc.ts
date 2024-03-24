
import axios from 'axios'

import { config } from '../../lib';

import { log } from '../../lib';

import  { Trace } from '../../lib/trace'

import oneSuccess from 'promise-one-success'

const rpcs = [{
    url: config.get('MONERO_WALLET_RPC_URL')
}]

class MoneroWalletRPCPool {

    async call<Response>(method: string, params: any): Promise<Response | any> {

        try {

            log.info('xmr.wallet.rpc.pool.call', { method, params })

            const result = await oneSuccess<Response>(rpcs.map(({ url }) => {

                const rpc = new MoneroWalletRPC({ url })
                
                return rpc.call<Response>(method, params)

            }))

            log.info('xmr.wallet.rpc.pool.result', { method, params, result })

            return result

        } catch(error: any) {

            error.method = method

            error.params = params

            log.error('xmr.wallet.rpc.pool.result', error)

            throw error;

        }

    }

}

interface NewMoneroWalletRpc {
    url: string;
}

class MoneroWalletRPC {

    url: string;

    constructor(params: NewMoneroWalletRpc) {

        this.url = params.url
    }

  async call<Response>(method: string, params: any): Promise<Response | any> {

    const trace = Trace();

    try {

      log.info(`xmr.wallet.rpc.call.${method}`, {params,trace});

      let { data: result } = await axios.post(`${this.url}/json_rpc`, {
        method: method,
        params: params || [],
        id: 0
      })

      log.info(`xmr.wallet.rpc.call.${method}.result`, {params, trace, result});

      return result
       
    } catch(error: any) {

      error.trace = trace

      error.params = params

      log.error(`xmr.rpc.call.${method}.error`, error)

      throw error

    }

  }

}

export const monero_wallet_rpc = new MoneroWalletRPCPool();
