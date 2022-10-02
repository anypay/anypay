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

  find(currency: string): Plugin {
    return this.findForCurrency(currency)
  }

  findForCurrency(currency: string) {

    if (!this.plugins[currency]) {

      throw new Error(`no plugin for currency ${currency}`);

    }

    let { plugin } = new Plugin(currency, this.plugins[currency]);

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
  plugin: any;
  database?: any;
  env?: any;

  constructor(currency: string, plugin?: any) {

    this.currency = currency;
    this.plugin = plugin;
  }

  getTransaction(txid) {
    return this.plugin.getTransaction(txid)
  }
  
}

const plugins = new Plugins();

plugins.load();


export {plugins};

