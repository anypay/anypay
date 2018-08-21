#!/usr/bin/env ts-node

require('dotenv').config();

const program = require("commander");
import {Account, MerchantBountyReward} from '../lib/models';
import {convert} from '../lib/prices';

program
  .command('createdashreward <merchantEmail> <ambassadorEmail> <dollarAmount>')
  .action(async (merchantEmail, ambassadorEmail, dollarAmount) => {

    let merchant = await Account.findOne({ where: {

      email: merchantEmail
      
    }});
    
    if (!merchant) {

      console.log(`merchant not found with email ${merchantEmail}`);

      process.exit(1);

    }

    let ambassador = await Account.findOne({ where: {

      email: ambassadorEmail
      
    }});

    if (!ambassador) {

      console.log(`ambassador not found with email ${ambassador}`);

      process.exit(1);

    }

    let dashAmount = await convert({ currency: 'USD', value: dollarAmount }, 'DASH');

    console.log('dashAmount', dashAmount);

    let reward = await MerchantBountyReward.create({
      merchant_id: merchant.id,
      ambassador_id: ambassador.id,
      denomination_currency: "USD",
      denomination_amount: dollarAmount,
      payment_currency: 'DASH',
      payment_amount: dashAmount.value
    });

    console.log("reward created", reward.toJSON());

  });

program
  .command('markrewardpaid <merchantEmail> <paymentHash>')
  .action(async (merchantEmail, paymentHash) => {

    let merchant = await Account.findOne({ where: {

      email: merchantEmail
      
    }});

    await MerchantBountyReward.update({
      payment_hash: paymentHash 
    }, {
      where: {
        merchant_id: merchant.id
      }
    })


  });

program.parse(process.argv);

