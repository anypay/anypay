
import {models} from '../models';
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

export async function getAccountRoute(account_id: number, input_currency: string) {

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

interface ProposedPaymentOption {
  account_id: number;
  address: string;
  currency: string;
}

export async function createAddressRoute(options: ProposedPaymentOption) {

  var outputAddressValue, outputCurrency;

  let accountRoute = await models.AccountRoute.findOne({ where: {

    account_id: options.account_id,

    input_currency: options.currency

  }});

  if (accountRoute) {

    outputAddressValue = accountRoute.output_address;

    outputCurrency = accountRoute.output_currency;

  } else {

    let outputAddress = await models.Address.findOne({ where: {

      account_id: options.account_id,

      currency: options.currency

    }});

    if (outputAddress) {

      outputAddressValue = outputAddress.value;

      outputCurrency = outputAddress.currency;

    } else {

      throw new Error(`no ${options.currency} address or route for account ${options.account_id}`)
    }

  }

  let addressRoute = await models.AddressRoute.create({

    input_currency: options.currency, 

    input_address: options.address, 

    output_currency: outputCurrency,

    output_address: outputAddressValue

  });

  return addressRoute;

}

export async function getAddressRoute(input_address, input_currency) {

  let addressRoute = await models.AddressRoute.findOne({ where : {

    input_address,

    input_currency

  }});

  if (!addressRoute) {

    throw new Error('no route found for input address and currency');

  }

  let route = {

    input: {

      address: input_address,

      currency: input_currency
    },

    output: {

      address: addressRoute.output_address,

      currency: addressRoute.output_currency

    },

    expires: addressRoute.expires
  }

  let hdKey = await models.Hdkeyaddresses.findOne({where:{
     address:input_address,
     currency:input_currency
  }})

  if( hdKey ){

    route['HDKeyAddress'] = hdKey.toJSON()

  }

  return route

}
