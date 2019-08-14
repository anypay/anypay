
import { models } from '../../../lib';

import * as Boom from 'boom';

export async function show(req, h) {

  let input_address = req.params.input_address;
  let input_currency = req.params.input_currency;

  console.log('address route', {
    input_address,
    input_currency
  });

  let addressRoute = await models.AddressRoute.findOne({ where : {

    input_address,

    input_currency

  }});
        
  if (!addressRoute) {

    return Boom.notFound('no route found for input address and currency');

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

  let hdKey = await models.HDKeyAddresses.findOne({where:{
     address:input_address,
     currency:input_currency
  }})

  console.log('hdkey', hdKey)
  if( hdKey ){
    
    route['HDKeyAddress'] = hdKey.toJSON()

  }

  return route

}

