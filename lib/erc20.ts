/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

require('dotenv').config()

import { hexToDec } from 'hex2dec'

import Web3 from 'web3'

import { ethers } from 'ethers'

import { config } from './config'

interface TransmitResult {
  blockHash: string,
  blockNumber: number,
  contractAddress: string,
  cumulativeGasUsed: number,
  effectiveGasPrice: number,
  from: string,
  gasUsed: number,
  logs: any[]
  logsBloom: string;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
}

export async function broadcastSignedTransaction({ txhex, providerURL }: {txhex: string, providerURL: string}): Promise<TransmitResult> {

  //const provider = new ethers.providers.JsonRpcProvider(providerURL)

  const web3 = new Web3(new Web3.providers.HttpProvider(providerURL))

  const transmitResult: any = await web3.eth.sendSignedTransaction(txhex)

  return transmitResult

}

export function decodeTransactionHex({ transactionHex }: {transactionHex: string}): ethers.Transaction {

  const transaction: ethers.Transaction = ethers.utils.parseTransaction(transactionHex)

  return transaction

}

export function parseERC20Transfer(transaction: ethers.Transaction): {
  receiver: string,
  amount: number,
  symbol: string,
  hash: string,
  sender: string,
} {

  const input = transaction.data;

  if (
    input.length !== 138 ||
    input.slice(2, 10) !== "a9059cbb"
  ) {
    throw "NO ERC20 TRANSFER";
  }
  const receiver = `0x${transaction.data.slice(34, 74)}`;
  const amount = Number(hexToDec(transaction.data.slice(74)));
  const symbol = String(transaction.to);
  const sender = String(transaction.from);
  const hash = String(transaction.hash)
  return { receiver, amount, symbol, hash, sender };
}

interface GetTransactionByHashResult {
  accessList?: any[];
  blockHash: string;
  blockNumber: number;
  chainId?: string;
  from: string;
  gas: number;
  gasPrice: string;
  hash: string;
  input: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  nonce: number;
  r: string;
  s: string;
  to: string;
  transactionIndex: number;
  type?: number;
  v: string;
  value: string;
}

export async function fetchERC20Transfer({ txid }: { txid: string }): Promise<{
  parsed: {
    address: string,
    amount: number,
    token: string
  },
  full: GetTransactionByHashResult
}> {

  const web3 = new Web3(new Web3.providers.HttpProvider(config.get('INFURA_POLYGON_URL')))

  const result: any = await web3.eth.getTransaction(txid)

  const input = result.input

  if (
    input.length !== 138 ||
    input.slice(2, 10) !== "a9059cbb"
  ) {
    throw "NO ERC20 TRANSFER";
  }
  const address = `0x${input.slice(34, 74)}`;
  const amount = parseInt(String(hexToDec(input.slice(74))));
  const token = result.to.toLowerCase();

  return {
    parsed: {
      address,
      amount,
      token
    },
    full: result
  }

}

