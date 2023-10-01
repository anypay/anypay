
import { accounts } from '@prisma/client';
import { log } from './log'
import { prisma } from './prisma';

/**
 * Gets an account setting.
 * 
 * @param account_id - The ID of the account for which the setting is being retrieved.
 * @param key - The key of the setting to be retrieved.
 * @param options - An object containing additional options like default value.
 * @returns A Promise that resolves to the value of the setting or a default value.
 */
export async function getAccountSetting(account_id: number, key: string, options: { default?: string } = {}): Promise<string | undefined> {
  // Try to find an existing record
  const record: AccountSetting | null = await prisma.accountSettings.findFirst({
    where: { account_id, key }
  });

  // If the record exists, return its value; otherwise, return the default value
  return record ? record.value : options.default;
}

interface AccountSetting {
  id: number;
  account_id: number;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Sets an account setting.
 * 
 * @param account_id - The ID of the account for which the setting is being set.
 * @param key - The key of the setting to be set.
 * @param value - The value to be set for the specified setting key.
 * @returns A Promise that resolves to the set account setting record.
 */
export async function setAccountSetting(account_id: number, key: string, value: string): Promise<AccountSetting | null> {
  log.info('account.settings.update', { account_id, key, value });

  let isNew = false;

  // Try to find an existing record
  let record = await prisma.accountSettings.findFirst({
    where: { account_id, key }
  });

  if (record === null) {
    // If not found, create a new record
    record = await prisma.accountSettings.create({
      data: { account_id, key, value, createdAt: new Date(), updatedAt: new Date() }
    });
    isNew = true;
  } else {
    // If found, update the existing record
    record = await prisma.accountSettings.update({
      where: { id: record.id },
      data: { value, updatedAt: new Date() }
    });
  }

  // Log whether the record is new
  log.info('Is record new?', isNew);

  return record;
}
/**
 * Sets the denomination for an account.
 *
 * @param account_id - The ID of the account for which the denomination is being set.
 * @param denomination - The new denomination value.
 * @returns A Promise that resolves to the new denomination value.
 */
export async function setDenomination(account_id: number, denomination: string): Promise<string> {
  // Update the account's denomination
  const updatedAccount: accounts | null = await prisma.accounts.update({
    where: { id: account_id },
    data: { denomination }
  });

  // Log the action
  log.info('account.denomination.set', { account_id, denomination });

  // Return the updated denomination
  return updatedAccount ? updatedAccount.denomination : 'Error updating denomination';
}

/**
 * Retrieves the denomination for a specific account.
 * 
 * @param accountId - The ID of the account for which the denomination is being retrieved.
 * @returns A Promise that resolves to the denomination of the account.
 */
export async function getDenomination(accountId: number): Promise<string | null> {
  // Retrieve the account information
  const account: accounts | null = await prisma.accounts.findFirst({
    where: { id: accountId }
  });

  // Return the denomination of the account
  return account ? account.denomination : null;
}

