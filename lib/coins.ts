// 
import { coins as Coin } from '@prisma/client'

export { Coin }

import prisma from './prisma';

var coins: Coin[] = [];

export async function refreshCoins(): Promise<Coin[]> {

  coins = await prisma.coins.findMany();

  return coins;

}

interface CoinConfig {
  code: string;
  currency: string;
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

