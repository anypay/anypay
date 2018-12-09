const Blockcypher = require('./blockcypher');
<<<<<<< HEAD
import * as models from '../models';
import { log } from '../logger';
import * as Util from './extended_public_key_util';
=======
const Invoice = require('../models/invoice');
import * as Address from '../models/address';
import * as Account from '../models/account';
import {models, xpub} from '../';
const Util = require('./extended_public_key_util');
>>>>>>> 0564aac... Allow set xpub key and generate invoice from

const DashPrice = require('./price');

export async function getNewAddress(accountId) {

  let address = (await models.Address.findOne({ where: { account_id: accountId, currency:'DASH' }})).value;

  if (!address) {
    throw new Error('no DASH address set');
  }

  let paymentEndpoint = await Blockcypher.createPaymentEndpoint(address);

  log.info('dash address generated', paymentEndpoint);

  let params = {
    payment_id: paymentEndpoint.id,
    destination: paymentEndpoint.destination,
    input_address: paymentEndpoint.input_address,
    mining_fees_satoshis: paymentEndpoint.mining_fees_satoshis,
    process_fees_satoshis: paymentEndpoint.process_fees_satoshis,
    process_fees_address: paymentEndpoint.process_fees_address,
    callback_url: paymentEndpoint.callback_url
  }

  let payment = await models.BlockcypherPaymentForward.create(params);

  log.info('blockcyphper.payment_forward.created', payment.toJSON());

  return paymentEndpoint.input_address;
}

