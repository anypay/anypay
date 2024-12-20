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
import { coins as Coin } from '@prisma/client'

export { Coin }

import prisma from '@/lib/prisma';

var coins: Coin[] = [];

export async function refreshCoins(): Promise<Coin[]> {

  coins = await prisma.coins.findMany();

  return coins;

}

export interface CoinConfig {
  code: string;
  currency: string;
  chain: string;
  name: string;
  enabled: boolean;
  supported: boolean;
  icon: string;
  address: string;
  unavailable: boolean;
}

export async function initFromConfig(coinsConfig: CoinConfig[]): Promise<Coin[]> {

  for (var i=0; i<coinsConfig.length; i++) {

    let coin = coinsConfig[i];

    let existingCoin: Coin | null = await prisma.coins.findFirst({ where: { code: coin.code }});

    if (!existingCoin) {

      await prisma.coins.create({
        data: {
          code: coin.code,
          chain: coin.chain,
          currency: coin.currency,
          name: coin.name,
          supported: coin.supported,
          logo_url: coin.icon,
          unavailable: coin.unavailable,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

    }

  }

  return refreshCoins();

}

export async function getCoins(): Promise<Coin[]> {

  return coins;

}

export async function deactivateCoin(code: string): Promise<Coin[]> {

  const coin = await prisma.coins.findFirst({ where: { code }});

  if (!coin) {
    throw new Error(`Coin not found: ${code}`);
  }

  await prisma.coins.update({
    where: { id: coin.id },
    data: {
      unavailable: true
    }
  
  })

  return refreshCoins();

}

export async function activateCoin(code: string): Promise<Coin[]> {

  const coin = await prisma.coins.findFirst({ where: { code }});

  if (!coin) {
    throw new Error(`Coin not found: ${code}`);
  }

  await prisma.coins.update({
    where: { id: coin.id },
    data: {
      unavailable: false
    }
  
  })

  return refreshCoins();

}

export function getCoin(currency: string): Coin | undefined {

  return coins.find(coin => {
    return coin.code === currency
  });

}

