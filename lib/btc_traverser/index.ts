require('dotenv').config()

import { rpc } from '../../plugins/btc/jsonrpc'

import * as btc from 'bitcore-lib';

const _ = require('lodash')

export class TxNode {
  tx: any;
  txid: string;
  rawtx: string;
  parents: TxNode[];
  children: TxNode[];
  replace_by_fee: boolean;
  constructor(txid, tx, rawtx) {
    this.tx = tx
    this.rawtx = rawtx
    this.txid = txid
    this.parents = []
    this.children = []
    let bitcoreTx = new btc.Transaction(rawtx)
    this.replace_by_fee = bitcoreTx.isRBF();
  }
}

export class BTCTraverser {
  txid: string;
  currentAncenstorLevel: number = 0;
  currentAncenstors: TxNode[];
  ancestorLevels: any = []

  constructor(txid) {
    this.txid = txid
  }

  async getNextAncesorLevel() {
    // get parents
    // set current ancestors as parents
    // update current ancestor level

    console.log("LEVEL", this.currentAncenstorLevel)

    if (this.currentAncenstorLevel === 0) {
      var node = await getNode(this.txid)
      var [node, parents] = await getParents(node)
      this.currentAncenstors = parents
    } else {
      let newAncestors = await Promise.all(this.currentAncenstors.map(async (node) => {
        let [n, parents] = await getParents(node)
        return parents
      }))
      this.currentAncenstors = _.flatten(newAncestors)
    }

    this.ancestorLevels[this.currentAncenstorLevel] = this.currentAncenstors
    this.currentAncenstorLevel = this.currentAncenstorLevel + 1

  }

  async traverseAncestors(levels: number) {

    for (let i=0; i<levels; i++) {
      await this.getNextAncesorLevel()
    }

  }

  getCurrentAncenstors() {
    return this.currentAncenstors
  }
}

export async function getTransaction(txid) {

  let response: any = await rpc.call('getrawtransaction', [txid, true])

  return [response.result.hex, response.result]

}

export async function getNode(txid): Promise<TxNode> {

  let [rawtx, tx] = await getTransaction(txid)

  let node = new TxNode(txid, tx, rawtx)

  return node

}

export async function getParents(node: TxNode): Promise<[TxNode, any[]]> {

  let parentTxids = node.tx.vin.map(vin => vin.txid)

  let parents: any[] = await Promise.all(parentTxids.map(txid => getNode(txid)))

  parents.forEach(parent => parent.children.push(node))

  node.parents = parents

  return [node, parents]

}

export function parseParents(tx) {
  return tx.vin.map(vin => vin.txid)
}

