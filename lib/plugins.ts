require("dotenv").config();
require('bitcore-lib')

import configurePlugins from "../config/plugins";
import * as assert from 'assert';

import { channel } from './amqp';

import { models } from './';

import { log } from './';

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

    log.info(`global.getNewAddress.account:${address.account_id}.currency:${address.currency}`);

    if(!this.plugins[currency].getNewAddress){

      return address.value

    } else {

      return await this.plugins[currency].getNewAddress(address, amount);
    }

  }

  async checkAddressForPayments(address: string, currency: string) {

    log.info(`global.checkaddressforpayments.${address}.${currency}`);

    if(!this.plugins[currency].checkAddressForPayments){
      throw new Error('plugin does not implement checkAddressForPayments')
    }

    let payments = await this.plugins[currency].checkAddressForPayments(address, currency);

    log.info(`checkaddressforpayments.found`, payments);

    payments.forEach(async payment => {

      let message = Buffer.from(JSON.stringify(payment));

      await channel.publish('anypay.payments', 'payment', message);

      log.info(`amqp.message.published`, `anypay.payments.${JSON.stringify(payment)}`);

    });

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

