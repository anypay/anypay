
import configurePlugins from "../config/plugins";

class Plugins {

  plugins: any;

  constructor() {
    this.load();
  }

  load() {

    let pluginsConfig = configurePlugins();

    this.plugins = pluginsConfig.plugins;
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

