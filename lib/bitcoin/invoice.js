const Invoice = require('../models/invoice');
const Account = require('../models/account');
const Address = require('../models/address');
const BitcoinAddressService = require('./address_service');
const BITCOIN_FEE_SATOSHIS = require('../blockcypher').BITCOIN_FEE;
const log = require('winston');

const BitcoinPrice = require('./price');

import {convert} from '../prices';

const BITCOIN_PROCESSING_FEE = (() => {
  const feeInBitcoin = BITCOIN_FEE_SATOSHIS * 0.00000001 // convert to bitcoin

  //return feeInBitcoin;
  return 0;
})();

module.exports.generate = async function generate(dollarAmount, accountId) {

  let payoutAddress = (await Address.findOne({where:{
	account_id:accountId,
  	currency:'BTC'
  }})).value

  if(!payoutAddress){

	throw new Error("No BTC address set")

  }

  let address = await BitcoinAddressService.getNewAddress(payoutAddress);

  let bitcoinAmount = await convert(
    { currency: 'USD',
      value: dollarAmount
    },
    'BTC'
  );

  const fee = BITCOIN_PROCESSING_FEE;
  const amountWithFee = bitcoinAmount.value + fee;
  
  log.info('bitcoin:amount', {
    withoutFee: bitcoinAmount.value,
    fee,
    amountWithFee
  });

  let invoice = await Invoice.create({
    address: address,
    amount: amountWithFee.toFixed(6),
    currency: 'BTC',
    dollar_amount: dollarAmount,
    account_id: accountId,
    status: 'unpaid'
  });

  return invoice;

}

