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
require("dotenv").config();
require('bitcore-lib')

import { plugins } from "@/config/plugins";

export { plugins }

import { Transaction } from '@/lib/plugin'

import {
  addresses as Address,
  accounts as Account
} from '@prisma/client'

import { Payment } from '@/lib/plugin'

import { SetPrice } from '@/lib/prices/price'

import { payment_options as PaymentOption } from "@prisma/client";

import { Confirmation } from '@/lib/confirmations'

export function find({currency, chain }: {currency: string, chain: string}) {

  let plugin = chain === currency ? plugins[currency] : plugins[`${currency}.${chain}`]

  if (!plugin) {

    throw new Error(`no plugin found for currency ${currency} on chain ${chain}`) 

  }

  return plugin

}


export async function getTransaction({ txid, chain, currency }: { txid: string, chain: string, currency: string }): Promise<Transaction> {

  let plugin = find({ chain, currency }) 

  return plugin.getTransaction(txid)

}

export async function parsePayments({ currency, chain, transaction }: { currency: string, chain: string, transaction: Transaction }): Promise<Payment[]> {

  let plugin = find({ chain, currency }) 

  return plugin.parsePayments(transaction)

}

export async function getNewAddress({ address, account, chain, currency }: { address: Address, account: Account, chain: string, currency: string }): Promise<string> {

  let plugin = find({ chain, currency }) 

  return plugin.getNewAddress({ account, address })

}

export function toSatoshis({decimal, currency, chain}:{ decimal: number, currency: string, chain: string }): number {

  const plugin = find({ currency, chain })

  return plugin.toSatoshis(decimal)

}

export function fromSatoshis({integer,currency,chain}: {integer: number, currency: string, chain: string }): number {

  const plugin = find({ currency, chain })

  return plugin.fromSatoshis(integer)

}

export function buildSignedPayment({paymentOption,mnemonic}: {paymentOption: PaymentOption, mnemonic: string}): Promise<Transaction> {

  const { currency, chain } = paymentOption

  const plugin = find({ currency, chain: chain as string })

  return plugin.buildSignedPayment({ paymentOption, mnemonic })

}

export function verifyPayment({paymentOption,transaction}: {paymentOption: PaymentOption, transaction: Transaction }): Promise<boolean> {

  const { currency, chain } = paymentOption

  const plugin = find({ currency, chain: chain as string })

  return plugin.verifyPayment({ paymentOption, transaction })

}

export function getPrice({chain,currency}: {chain:string, currency:string }): Promise<SetPrice> {

  const plugin = find({ currency, chain })

  return plugin.getPrice()

}

export function getConfirmation({txid, chain,currency}: {txid: string, chain:string, currency:string }): Promise<Confirmation | null> {

  const plugin = find({ currency, chain })

  return plugin.getConfirmation(txid)

}

