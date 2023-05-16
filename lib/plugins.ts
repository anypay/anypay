require("dotenv").config();
require('bitcore-lib')

import configurePlugins from "../config/plugins";

export const plugins = configurePlugins()

import { Plugin, Transaction } from './plugin'

import { Account } from './account'

export function find({currency, chain }: {currency: string, chain: string}): Plugin {

  let plugin = chain === currency ? plugins[currency] : plugins[`${currency}.${chain}`]

  if (!plugin) {

    throw new Error(`no plugin found for currency ${currency} on chain ${chain}`) 

  }

  return new plugin()
}


export async function getTransaction({ txid, chain, currency }: { txid: string, chain: string, currency: string }): Promise<Transaction> {

  let plugin = await find({ chain, currency }) 

  return plugin.getTransaction(txid)

}

export async function getNewAddress({ account, chain, currency }: { account: Account, chain: string, currency: string }): Promise<string> {

  let plugin = await find({ chain, currency }) 

  return plugin.getNewAddress(account)

}
