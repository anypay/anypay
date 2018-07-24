
import configurePlugins from "../config/plugins";
import * as assert from 'assert';

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

    return plugin;

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
    this.plugin = plugin
  }
  
}

const plugins = new Plugins();

plugins.load();

export {plugins};

