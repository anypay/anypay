require("dotenv").config();

import configurePlugins from "../config/plugins";
import * as assert from 'assert';
import {connect, Channel} from 'amqplib';

import { models } from './';

import { log } from './';

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

  async getNewAddress(currency: string, accountId: number) {

    let address = await models.Address.findOne({ where: {

      currency,

      account_id: accountId 

    }});

    if (!address) {
      throw new Error(`${currency} address not found for account ${accountId}`);
    }

    log.info(`global.getNewAddress.account:${address.account_id}.currency:${address.currency}`);

    if(!this.plugins[currency].getNewAddress){
      throw new Error('plugin does not implement getNewAddress')
    }

    let input = await plugins[currency].getNewAddress(address);

    return input;

  }

  async checkAddressForPayments(address: string, currency: string) {

    log.info(`global.checkaddressforpayments.${address}.${currency}`);

    if(!this.plugins[currency].checkAddressForPayments){
      throw new Error('plugin does not implement checkAddressForPayments')
    }

    let payments = await this.plugins[currency].checkAddressForPayments(address, currency);

    log.info(`checkaddressforpayments.found`, payments);

    payments.forEach(async payment => {

      let message = new Buffer(JSON.stringify(payment));

      await this.channel.publish('anypay.payments', 'payment', message);

      log.info(`amqp.message.published`, `anypay.payments.${JSON.stringify(payment)}`);

    });

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

