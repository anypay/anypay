import { models } from '../models';

export async function getStaticAddressRoute(account_id: number, currency: string) {

  return models.AddressRoute.findOne({

    where: {

      account_id,

      input_currency: currency,

      is_static: true

    }

  });

}

export async function setStaticAddress(account_id: number, currency: string, address:string) {

  // find static address route 

  let route = await  models.AddressRoute.findOne({

    where: {

      account_id,

      input_currency: currency,

      is_static: true

    }

  });

  if (route) {

    throw new Error(`${currency} static address already set for account ${account_id}`);

  }

  let accountAddress = await models.Address.findOne({ where: {

    currency,

    account_id

  }});

  if (!accountAddress) {

    throw new Error(`no BCH account address for account id ${account_id}`);

  }

  route = await models.AddressRoute.create({

    account_id,
    
    input_currency: currency,

    input_address: address,

    output_currency: currency,

    output_address: accountAddress.value,

    is_static: true

  });

  return route;

}


