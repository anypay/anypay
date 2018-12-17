const Invoice = require('../models/invoice');
const Account = require('../models/account');
const DashAddressService = require('./forwarding_address_service');
const jayson = require('jayson');

import {convert} from '../prices';

const DashPrice = require('./price');

var rpcClient = jayson.client.http({ host: '149.56.89.142', port: 12333 });

function addAddress(address) {
  return new Promise((resolve, reject) => {

    rpcClient.request('addaddress', [address], (err, resp) => {
      if (err) { return reject(err) }
      resolve(resp);
    });
  });
}

module.exports.generate = async function generate(dollarAmount, accountId):
Promise<any> {

  console.log('about to genereate dash address')

  let payoutAddress = await models.Address.findOne({
  	where: {
		currency: 'DASH',
		account_id: accountId
	}
  });


  address = await DashAddressService.getNewAddress(payoutAddress.value)

  console.log('dash address generated', address);

  const denominationAmount = {
    currency: 'USD',
    value: dollarAmount
  }; 

  let dashAmount = await convert(denominationAmount, 'DASH');

  var invoice = await Invoice.create({
    address: address,
    amount: dashAmount.value,
    currency: dashAmount.currency,
    dollar_amount: dollarAmount,
    account_id: accountId,
    status: 'unpaid'
  })

  return invoice;
}

