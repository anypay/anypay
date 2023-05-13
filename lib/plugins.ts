require("dotenv").config();
require('bitcore-lib')

import configurePlugins from "../config/plugins";

import { Account } from './account'

import { Address } from './addresses'

export interface BroadcastTxResult {
  txid: string;
  txhex: string;
  success: boolean;
  result: any;
}

export interface VerifyPayment {
  payment_option: any;
  transaction: {
      tx: string;
  };
  protocol: string;
}

export const plugins = configurePlugins()

export function find({currency, chain }: {currency: string, chain: string}): Plugin {

  let plugin = plugins[`${currency}.${chain}`]

  if (!plugin) {

    throw new Error(`no plugin found for currency ${currency} on chain ${chain}`) 

  }

  return plugin
}

export interface Transaction {
  hex: string
}

export abstract class Plugin {

  currency: string;

  chain: string;

  decimals: number;

  token: string;

  abstract verifyPayment(params: VerifyPayment): Promise<boolean>;

  abstract validateAddress(address: string): Promise<boolean>;

  abstract getTransaction(txid: string): Promise<Transaction>;

  abstract broadcastTx(txhex: string): Promise<BroadcastTxResult>;

  abstract getNewAddress(account: Account): Promise<Address>;
  
}

