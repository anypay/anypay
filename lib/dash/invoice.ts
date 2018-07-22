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

  var account = await Account.findOne({ where: { id: accountId }})

  if (!account || !account.dash_payout_address) {
    throw new Error('no dash payout address');
  }

  console.log('about to genereate dash address')

  var address = await DashAddressService.getNewAddress(dollarAmount, account.dash_payout_address)

  console.log('dash address generated', address);

  //let dashAmount = DashPrice.convertDollarsToDash(dollarAmount).toFixed(5);

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

  //await addAddress(address);

  return invoice;
}

