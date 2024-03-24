#!/usr/bin/env ts-node

require("dotenv").config()

import { Command } from 'commander'

const program = new Command()

import { Keypair, Connection, PublicKey, Transaction } from "@solana/web3.js";

import { createTransferInstruction, getOrCreateAssociatedTokenAccount } from '@solana/spl-token'

import axios from 'axios'
import { config } from '../../lib';

const SOLANA_MAINNET_USDC_PUBKEY = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
//const SOLANA_MAINNET_USDT_PUBKEY = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"

const USDC = new PublicKey(SOLANA_MAINNET_USDC_PUBKEY)
//const USDT = new PublicKey(SOLANA_MAINNET_USDT_PUBKEY)


program
  .command('pay-invoice <uid> <currency>')
  .action(async (uid, currency) => {

    const amount = 1_000_000 * 0.05

    const connection = new Connection(config.get('ALCHEMY_URL_SOLANA'))

    const fromWallet = Keypair.fromSeed(Uint8Array.from(
      JSON.parse(config.get('SOLANA_PHANTOM_SEED')).slice(0, 32)
    ))

    const fromAccountInfo = await connection.getAccountInfo(fromWallet.publicKey)

    console.log(fromAccountInfo, 'fromAccountInfo')

    const toWallet = new PublicKey('Ef9ca7Uwkw9rrbdaWnUrrdMZJqPYykZ1dPLEv9yMpEjB')

    const toAccountInfo = await connection.getAccountInfo(toWallet);
    console.log({ toAccountInfo })

    // Create associated token accounts for my token if they don't exist yet
    var fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet, // payer
      USDC, // mint
      fromWallet.publicKey // owner
    )
    console.log({ fromTokenAccount })

    var toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      USDC,
      toWallet
    )
    console.log({ toTokenAccount }, toTokenAccount.address.toBase58())


    const instruction = createTransferInstruction(
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      amount
    )

    var transaction = new Transaction()

    transaction.add(instruction)


    transaction.feePayer = await  fromWallet.publicKey;
    let blockhashObj = await connection.getLatestBlockhash();
    transaction.recentBlockhash = await blockhashObj.blockhash;

    transaction.sign(fromWallet)

    const txhex = transaction.serialize().toString('hex')

    console.log({ txhex })

    try {

      const { data } = await axios.post(`http://localhost:5200/r/${uid}`, {
        chain: 'SOL',
        currency: 'USDC',
        transactions: [{
          tx: txhex
        }]
      }, {
        headers: {
          'content-type': 'application/payment'
        }        
      })

      console.log(data, 'post response')

    } catch(error) {

      console.error(error)
    }

    

  })

program.parse(process.argv)
