import * as Blockcypher from './blockcypher';

import * as models from '../models';

import * as log from 'winston';

export async function getNewAddress(accountId: number): Promise<string> {

  const address = await models.Address.findOne({where:{account_id:accountId, currency:"LTC"}}) 

  if(!address){

  	throw new Error("LTC address not set")

  }

  const paymentEndpoint = await Blockcypher.createPaymentEndpoint(address);

  console.log('litecoin address generated', paymentEndpoint);

  return paymentEndpoint.input_address;
};

