
import * as models from '../models';
import { log } from '../logger';

export interface AccountRoute {
  account_id: number;
  input_currency: string;
  output_currency: string;
  output_address: string;
}

export interface AccountRouteLookup {
  account_id: number,
  input_currency: string;
}

export async function getAccountRoute(account_id: integer, input_currency: string) {

  let accountRoute = await models.AccountRoute.findOne({ where: {

    account_id,

    input_currency

  }});

}

export async function createAccountRoute(params: AccountRoute) {

  let accountRoute = await models.AccountRoute.create(params);

}

export async function removeAccountRoute(params: AccountRouteLookup) {

  await models.AccountRoute.destroy({ where: params });

}

