import * as database from '../../../lib/database';
import * as logger from 'winston';
import {monthly} from '../../../lib/totals';

export async function byCurrency(request) {
  
  let accountId = request.auth.credentials.accessToken.account_id;

  let currency = request.params.currency.toUpperCase();

  let totals = await monthly.forAccount(accountId).forCurrency(currency);
  
  return totals;
}

export async function total(request) {
  
  let accountId = request.auth.credentials.accessToken.account_id;
}

export async function usd(request) {
  
  let accountId = request.auth.credentials.accessToken.account_id;
}

