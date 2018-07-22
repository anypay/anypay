import * as Blockcypher from './blockcypher';
import * as Account from '../models/account';
import * as log from 'winston';

export async function getNewAddress(accountId: number): Promise<string> {

  const account = await Account.findOne({ where: { id: accountId }});

  const address = account.litecoin_address;

  const paymentEndpoint = await Blockcypher.createPaymentEndpoint(address);

  console.log('litecoin address generated', paymentEndpoint);

  return paymentEndpoint.input_address;
};

