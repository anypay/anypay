import {models} from '../'

const Blockcypher = require('./blockcypher');

module.exports.getNewAddress = async function getNewAddress(accountId) {
	
  let address = (await models.Address.findOne({ where:{
	  account_id: accountId,
	  currency:'BTC'
  }})).value

  if (!address) {
    throw new Error('no bitcoin BTC address set');
  }

  let paymentEndpoint = await Blockcypher.createPaymentEndpoint(address);

  console.log('bitcoin address generated', paymentEndpoint);

  return paymentEndpoint.input_address;
}

