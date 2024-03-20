

import { accounts as Account, invoices as Invoice } from '@prisma/client'

import { log } from './log'

import * as _ from 'underscore'
import prisma from './prisma';

export interface SearchResult {
  type: 'invoice' | 'account'; // invoice, account, etc
  value: Invoice | Account;
  where?: any; // original query
};

export async function search(query: string, account?: Account): Promise<SearchResult[]> {

  if (account) {
    log.info('search', { query, account_id: account.id })
  } else {
    log.info('search', { query })
  }

  let result = await Promise.all([
    searchInvoiceUid(query, account),
    searchInvoiceHash(query, account),
    searchInvoiceExternalId(query, account),
    searchAccountEmail(query, account)
  ])

  return _.flatten(result.filter(r => !!r))

}

export async function searchInvoiceUid(uid: string, account?: Account): Promise<SearchResult[]>{

  const where: {
    uid: string;
    account_id?: number;
  
  } = { uid }

  if (account) {
    where['account_id'] = account.id
  }

  const invoice = await prisma.invoices.findFirst({ where })

  if (invoice) {
    return [{ type: 'invoice', value: invoice, where }]
  }
  return []

}

export async function searchAccountEmail(email: string, account?: Account): Promise<SearchResult[]> {

  const where: {
    email: string;
    id?: number;
  
  
  } = { email }

  if (account) { where['id'] = account.id }

  const value = await prisma.accounts.findFirst({ where })

  if (value) {
    return [{ type: 'account', value, where }]
  } else {
    return []
  }

}

export async function searchInvoiceHash(hash: string, account?: Account): Promise<SearchResult[]> {

  const where: {
    hash: string;
    account_id?: number;
  
  } = { hash }

  if (account) { where['account_id'] = account.id }

  const value = await prisma.invoices.findFirst({ where })

  if (value) {
    return [{ type: 'invoice', value, where }]
  } else {
    return []
  }

}

export async function searchInvoiceExternalId(external_id: string, account?: Account): Promise<SearchResult[]> {

  const where: {
    external_id: string;
    account_id?: number;

  } = { external_id }

  if (account) { where['account_id'] = account.id }

  const value = await prisma.invoices.findFirst({ where })

  if (value) {
    return [{ type: 'invoice', value, where }]
  } else {
    return []
  }

}

