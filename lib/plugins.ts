require("dotenv").config();
require('bitcore-lib')

import configurePlugins from "../config/plugins";

import { models } from './';

export interface BroadcastTxResult {
  txid: string;
  txhex: string;
  success: boolean;
  result: any;
}

class Plugins {

  plugins: any;

  constructor() {
    this.load();
  }

  load() {

    let pluginsConfig = configurePlugins();

    Object.keys(pluginsConfig).forEach(key => {
      let plugin = pluginsConfig[key];

      if (plugin) {

      // assert(
      //    (typeof plugin.createInvoice) === 'function',
      //    'plugin must implement createInvoice'
      //  );
      }

    });

    this.plugins = pluginsConfig;
  }

  find({currency, chain }: {currency: string, chain: string}): Plugin {

    let plugin = this.findForChain(chain)

    if (!plugin) { return }

    if (typeof plugin.forCurrency === 'function') {

      plugin = plugin.forCurrency(currency)

    }

    return plugin
  }

  findForChain(chain: string) {

    if (!this.plugins[chain]) {

      throw new Error(`no plugin for currency ${chain}`);

    }

    let { plugin } = new Plugin(chain, this.plugins[chain]);

    return plugin;

  }

  async getNewAddress(currency: string, accountId: number, amount) {

    let address = await models.Address.findOne({ where: {

      currency,

      account_id: accountId 

    }});

    if (!address) {
      throw new Error(`${currency} address not found for account ${accountId}`);
    }

    if(!this.plugins[currency].getNewAddress){

      return address.value

    } else {

      return await this.plugins[currency].getNewAddress(address, amount);
    }

  }

}

class Plugin {
  currency: string;
  chain: string;
  plugin: any;
  database?: any;
  env?: any;

  constructor(currency: string, plugin?: any) {

    this.currency = currency;
    this.plugin = plugin;
  }

  async verifyPayment() {
    return this.plugin.verifyPayment(...arguments)
  }

  getTransaction(txid) {
    return this.plugin.getTransaction(txid)
  }

  broadcastTx(txhex) {
    return this.plugin.broadcastTx(txhex)
  }
  
}

const plugins = new Plugins();

plugins.load();


export {plugins};

