import { accounts } from "@prisma/client";
import { prisma } from "./prisma";

interface StubOptions {
  business_name: string;
  city?: string;
}

/**
 * Options for building an account stub.
 */
interface StubOptions {
  business_name: string;
  city?: string;
}

/**
 * Builds an account stub based on business name and optionally, city.
 * 
 * @param options - Object containing business name and optionally city for stub creation.
 * @returns The generated account stub.
 */
export function build(options: StubOptions): string {
  const punctuation: RegExp = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

  let accountStub: string = options.business_name.toLowerCase().replace(punctuation, '').replace(/ /g, '-');

  if (options.city) {
    const cityStub: string = options.city.toLowerCase().replace(punctuation, '').replace(/ /g, '-');
    accountStub = `${accountStub}-${cityStub}`;
  }

  return accountStub;
}

/**
 * Updates an account's stub based on the account's business name and optionally, city.
 * 
 * @param account - The account object to be updated.
 * @returns A Promise that resolves when the account's stub is updated.
 */
export async function updateAccount(account: accounts): Promise<void> {
  let existing: accounts | null;
  let accountStub: string;

  if (!account.business_name) {
    existing = await prisma.accounts.findFirst({ where: { stub: account.id.toString() } });
    if (!existing) {
      account.stub = account.id.toString();
      await prisma.accounts.update({
        where: { id: account.id },
        data: { stub: account.stub }
      });
      return;
    }
  }

  accountStub = build({ business_name: account.business_name });
  existing = await prisma.accounts.findFirst({ where: { stub: accountStub } });

  if (!existing) {
    await prisma.accounts.update({
      where: { id: account.id },
      data: { stub: accountStub }
    });
  } else {
    if (account.city) {
      accountStub = build({ business_name: account.business_name, city: account.city });
      existing = await prisma.accounts.findFirst({ where: { stub: accountStub } });
      if (!existing) {
        await prisma.accounts.update({
          where: { id: account.id },
          data: { stub: accountStub }
        });
      }
    }
  }
}