
import { models }  from '../index';
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

export async function createAddressRoute(invoice) {

  var outputAddressValue, outputCurrency;

  let accountRoute = await models.AccountRoute.findOne({ where: {

    account_id: invoice.account_id,

    input_currency: invoice.currency

  }});

  if (accountRoute) {

    outputAddressValue = accountRoute.output_address;

    outputCurrency = accountRoute.output_currency;

  } else {

    let outputAddress = await models.Address.findOne({ where: {

      account_id: invoice.account_id,

      currency: invoice.currency

    }});

    if (outputAddress) {

      outputAddressValue = outputAddress.value;

      outputCurrency = outputAddress.currency;

    } else {

      throw new Error(`no address or route for invoice ${invoice.uid}`)
    }

  }

  let addressRoute = await models.AddressRoute.create({

    input_currency: invoice.currency, 

    input_address: invoice.address, 

    output_currency: outputCurrency,

    output_address: outputAddressValue

  });

  return addressRoute;

}
