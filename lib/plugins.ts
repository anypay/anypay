require("dotenv").config();

import configurePlugins from "../config/plugins";
import * as assert from 'assert';
import {connect, Channel} from 'amqplib';
import {Invoice} from '../types/interfaces'

class Plugins {

  plugins: any;

  channel?: Channel;

  constructor() {
    this.load();
  }

  async connectAmqp() {
    let connection = await connect(process.env.AMQP_URL);
    this.channel = await connection.createChannel();

    await this.channel.assertExchange('anypay.payments', 'direct');
  }

  load() {

    let pluginsConfig = configurePlugins();

    Object.keys(pluginsConfig).forEach(key => {
      let plugin = pluginsConfig[key];

      if (plugin) {

        assert(
          (typeof plugin.createInvoice) === 'function',
          'plugin must implement createInvoice'
        );
      }

    });

    this.plugins = pluginsConfig;
  }

  async findForCurrency(currency: string) {

    if (!this.plugins[currency]) {

      throw new Error(`no plugin for currency ${currency}`);

    }

    let plugin = new Plugin(currency, this.plugins[currency]);

    return plugin.plugin;

  }

  async checkAddressForPayments(address: string, currency: string) {

    if(!this.plugins[currency].checkAddressForPayments){
	throw new Error('plugin does not implement checkAddressForPayments')
    }

    this.plugins[currency].checkAddressForPayments(address, currency);

 }

 async checkInvoiceForPayment(invoice:Invoice) {

   this.plugins[invoice.currency].checkAddressForPayments(invoice.address, invoice.currency);

 }

}

class Plugin {
  currency: string;
  plugin: any;
  database?: any;
  channel?: any;
  env?: any;

  constructor(currency: string, plugin?: any) {

    this.currency = currency;
    this.plugin = plugin;
  }
  
}

const plugins = new Plugins();

plugins.load();

(async function() {

  await plugins.connectAmqp();

})()

export {plugins};

