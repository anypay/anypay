require('bitcore-lib')

import { join } from 'path'

interface BraodcastTransaction {
  tx_hex: string;
  tx_id?: string;
  tx_key?: string;
}

export interface PluginImplementation {

  broadcastTx(params: BraodcastTransaction): Promise<BroadcastTransactionResult>;

  getTransaction?(txid: string): Promise<string>;

  transformAddress?({ value }: { value: string }): string;

  validateAddress?(address: string): boolean;
  
}

abstract class AbstructPlugin implements PluginImplementation {
  
  currency: string;

  bitcore?: any;

  abstract getTransaction(txid: string): Promise<string>;

  abstract broadcastTx(params: BraodcastTransaction): Promise<BroadcastTransactionResult>;

  abstract getNewAddress({ value }: { value: string }): Promise<string>;

  abstract transformAddress({ value }: { value: string }): string;

  abstract validateAddress(address: string): boolean;
  
}

export abstract class Plugin extends AbstructPlugin {

  constructor(currency?: string) {

    super()

    if (currency) {

      this.currency = currency

    }

    plugins[this.currency] = this
  }

  getNewAddress({ value }) { return value }

  transformAddress({ value }) { return value }

}

export interface BroadcastTransactionResult {

  tx_hex: string;
  
  tx_id: string;

  currency: string;

  chain?: string;

  result?: any;

  success: boolean;

}

type PluginsMap = {
  [key: string]: Plugin | any;
}

const plugins: PluginsMap = {}

export default function(currency: string) {

  return plugins[currency]

}

require('require-all')({

  dirname: join(__dirname, '../plugins'),

  recursive: true,

  filter:  /index.ts$/

});