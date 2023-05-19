#!/usr/bin/env ts-node

import { program } from 'commander'

import { getRPC } from '../rpc'

program
  .command('listunspent <chain> <address>')
  .action(async (chain, address) => {

    let {listUnspent} = getRPC(chain)

    let utxos = await listUnspent(address)

    console.log(utxos)

  })

program.parse(process.argv)
