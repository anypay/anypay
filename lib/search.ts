
import { models } from './models'

import { Account } from './account'

import { log } from './log'

import * as _ from 'underscore'

export interface SearchResult {
  type: string; // invoice, account, etc
  value: any;
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

async function searchInvoiceUid(uid: string, account?: Account): Promise<SearchResult[]>{

  const where = { uid }

  if (account) {
    where['account_id'] = account.id
  }

  let value = await models.Invoice.findOne({ where })

  if (value) {
    return [{ type: 'invoice', value, where }]
  }
  return []

}

async function searchAccountEmail(email: string, account?: Account): Promise<SearchResult[]> {

  const where = { email }

  if (account) { where['id'] = account.id }

  let value = await models.Account.findOne({ where })

  if (value) {
    return [{ type: 'account', value, where }]
  }

}

async function searchInvoiceHash(hash: string, account?: Account): Promise<SearchResult[]> {

  const where = { hash }

  if (account) { where['account_id'] = account.id }

  let value = await models.Invoice.findOne({ where })

  if (value) {
    return [{ type: 'invoice', value, where }]
  }

}

async function searchInvoiceExternalId(external_id: string, account?: Account): Promise<SearchResult[]> {

  const where = { external_id }

  if (account) { where['account_id'] = account.id }

  let value = await  models.Invoice.findOne({ where })

  if (value) {
    return [{ type: 'invoice', value, where }]
  }

}

