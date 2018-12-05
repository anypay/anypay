#!/usr/bin/env ts-node

var prompt = require('prompt-sync')();

var sendANY = require('commander');

var stellar = require('stellar-sdk');

stellar.Network.usePublicNetwork();

sendANY
  .command('send <address> <amount>')
  .action(async (destination, amount) => {

    let publicKey = prompt.hide('enter stellar account: ');
    let secret = prompt.hide('enter stellar secret key: ');

    let asset = new stellar.Asset(
      'ANY',
      'GATXYCZDOR5H4FTILZ3HDOIOPBMCDZWSSFWIOQIBIQUVY5XRBDMQGW7L'
    );

    let server = new stellar.Server('https://horizon.stellar.org')

    let account = await server.loadAccount(publicKey);

    let transaction = new stellar.TransactionBuilder(account)
      .addOperation(stellar.Operation.payment({
        destination,
        asset,
        amount
      }))
      .build();

    console.log(transaction);

    transaction.sign(stellar.Keypair.fromSecret(secret));

    console.log(transaction);

    //try {

      let result = await server.submitTransaction(transaction);
      console.log('result', result);

    /*} catch(error) {

      console.error('error', error.msg);

    }*/

  });
  
sendANY.parse(process.argv);

