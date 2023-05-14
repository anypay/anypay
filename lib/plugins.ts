require("dotenv").config();
require('bitcore-lib')

import configurePlugins from "../config/plugins";

export const plugins = configurePlugins()

import { Plugin } from './plugin'

export function find({currency, chain }: {currency: string, chain: string}): Plugin {

  let plugin = chain === currency ? plugins[currency] : plugins[`${currency}.${chain}`]

  if (!plugin) {

    throw new Error(`no plugin found for currency ${currency} on chain ${chain}`) 

  }

  return new plugin()
}

