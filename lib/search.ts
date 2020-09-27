
import { models } from './models'

import * as _ from 'underscore'

export interface SearchResult {
  type: string; // invoice, account, etc
  value: any;
};

export async function search(query: string): Promise<SearchResult[]> {

  let result = await Promise.all([
    searchInvoiceUid(query),
    searchInvoiceHash(query),
    searchInvoiceAddress(query),
    searchInvoiceExternalId(query),
    searchAccountEmail(query)
  ])

  return _.flatten(result.filter(r => !!r))

}

async function searchInvoiceUid(query: string): Promise<SearchResult[]> {

  let value = await models.Invoice.findOne({
    where: {
      uid: query
    } 
  });

  if (value) {
    return [{ type: 'invoice', value }]
  }

}

async function searchAccountEmail(query: string): Promise<SearchResult[]> {

  let value = await models.Account.findOne({
    where: {
      email: query
    } 
  });

  if (value) {
    return [{ type: 'account', value }]
  }

}

async function searchInvoiceHash(query: string): Promise<SearchResult[]> {

  let value = await models.Invoice.findOne({
    where: {
      address: query
    } 
  });

  if (value) {
    return [{ type: 'invoice', value }]
  }

}

async function searchInvoiceAddress(query: string): Promise<SearchResult[]> {

  let value = await models.Invoice.findOne({
    where: {
      external_id: query
    } 
  });

  if (value) {
    return [{ type: 'invoice', value }]
  }

}

async function searchInvoiceExternalId(query: string): Promise<SearchResult[]> {

  let value = await  models.Invoice.findOne({
    where: {
      hash: query
    } 
  });

  if (value) {
    return [{ type: 'invoice', value }]
  }

}

