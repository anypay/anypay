
import axios from 'axios'
import { config } from '../../lib';

import { log } from '../../lib/log';

import  { Trace } from '../../lib/trace'

import oneSuccess from 'promise-one-success'

const monerod_rpcs = [{
    "host": "127.0.0.1",
    "port": 18081,
    "labels": ["anypay"]
}]

export class MonerodRPCPool {

  async call<Response>(method: string, params: any): Promise<Response | any> {

      try {

          log.info('xmr.rpc.pool.call', { method, params })

          const result = await oneSuccess<Response>(monerod_rpcs.map(({ host, port }: { host: string, port: number}) => {

              const rpc = new JsonRPC({ host, port })
              
              return rpc.call<Response>(method, params)

          }))

          log.info('xmr.rpc.pool.result', { method, params, result })

          return result

      } catch(error: any) {

          error.method = method

          error.params = params

          log.error('xmr.rpc.pool.result', error)

          throw error;

      }

  }

}

export class JsonRPC {

  url: string;

  constructor({ host, port }: { host: string, port: number }) {

      this.url = `http://${host}:${port}`
  }

  async call<Result>(method: string, params: any): Promise<Result> {

    const trace = Trace();

    try {

      log.info(`xmr.rpc.call.${method}`, {params,trace, url: this.url});

      let { data } = await axios.post(`${this.url}/json_rpc`, {
        method: method,
        params: params || [],
        id: 0
      })

      log.info(`xmr.rpc.call.${method}.result`, {params, trace, result: data.result});

      return data.result
       
    } catch(error: any) {

      error.trace = trace

      log.error(`xmr.rpc.call.${method}.error`, error)

      throw error

    }

  }

}

class MonerodOtherRPC {

  url: string;

  constructor({ host, port }: { host: string, port: number }) {

    this.url = `http://${host}:${port}`
}

  async call<Result>(method: string, params: any): Promise<Result> {

    const trace = Trace();

    try {

      log.info(`xmr.rpc.other.call.${method}`, {params,trace});

      let { data: result } = await axios.post(`${config.get('XMR_RPC_URL')}${method}`, params)

      log.info(`xmr.rpc.other.call.${method}.result`, {params, trace, result});

      return result
       
    } catch(error: any) {

      error.trace = trace

      log.error(`xmr.rpc.call.${method}.error`, error)

      throw error

    }


  }

}

export class MonerodOtherRPCPool {

  async call<Response>(method: string, params: any): Promise<Response | any> {

      try {

          log.info('xmr.rpc.other.pool.call', { method, params })

          const result = await oneSuccess<Response>(monerod_rpcs.map(({ host, port }: {host: string, port: number}) => {

              const rpc = new MonerodOtherRPC({ host, port })
              
              return rpc.call<Response>(method, params)

          }))

          log.info('xmr.rpc.other.pool.result', { method, params, result })

          return result

      } catch(error: any) {

          error.method = method

          error.params = params

          log.error('xmr.rpc.other.pool.result.error', error)

          throw error;

      }

  }

}

export const json_rpc = new MonerodRPCPool();

export const other_rpc = new MonerodOtherRPCPool();
