

import { log } from './log'
import { prisma } from './prisma';

interface MerchantInfo {
  business_address: string;
  business_name: string;
  latitude: number;
  longitude: number;
  image_url: boolean;
  account_id: number;
  denomination: string;
}

/**
 * Find account by either `stub` as a string or `id` as a number.
 *
 * @param identifier - The identifier that could be either stub or id
 * @returns A Promise that resolves to the found account or null
 */
async function findAccountByIdentifier(identifier: string | number): Promise<any | null> {
  // Try to find the account by 'stub' first
  let account = await prisma.accounts.findFirst({
    where: {
      OR: [
        { stub: identifier.toString() },
        { id: typeof identifier === 'string' ? parseInt(identifier, 10) : identifier }
      ]
    }
  });

  return account;
}

export async function getMerchantInfo(identifier: any): Promise<MerchantInfo> {

  log.info('merchants.getMerchantInfo', { identifier })

  const account = await findAccountByIdentifier(identifier);

  if (!account) {
    throw new Error('no account found');
  }

  return {
    business_name: account.business_name,
    business_address: account.business_address,
    latitude: parseFloat(account.latitude),
    longitude: parseFloat(account.longitude),
    image_url: account.image_url,
    account_id: account.id,
    denomination: account.denomination
  }

}