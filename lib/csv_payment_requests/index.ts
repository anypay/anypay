const parse = require('csv-parse');

import BigNumber from 'bignumber.js';
import * as moment from 'moment';
import * as bitcoin from 'bsv';
import * as polynym from 'polynym';

import { v4 } from 'uuid';

function csvToArray(csv) {
  return new Promise((resolve, reject) => {

    parse(csv, {}, function(err, output) {

      resolve(output);

    });

  });
}


export async function createPaymentRequestFromCsv(csvFile) {

  let rows: any = await csvToArray(csvFile);

  let firstRow = rows.shift();

  let outputs = await Promise.all(rows.map(async (row) => {

    let resolution = await polynym.resolveAddress(row[1]);

    console.log(row[1], resolution.address);

    let address = new bitcoin.Address(resolution.address);

    let script = (new bitcoin.Script(address)).toHex();

    let amount = bsvToSatoshis(parseFloat(row[0]));

    return {
      script, amount 
    }

  }));

  let uid = v4();

  let request = {
    network:"bitcoin-sv",
    outputs,
    creationTimestamp: moment().unix(),
    expirationTimestamp: moment().add(1, 'day').unix(),
    memo: "Multi Recipient Payment Request From CSV",
    paymentUrl: `${process.env.API_BASE}/invoices/${uid}/pay`,
    merchantData: JSON.stringify({
      invoiceUid: uid,
      merchantName: `${firstRow[0]} ${outputs.length} recipients`,
      avatarUrl: firstRow[1]
    })
  }

  return request;

}

function bsvToSatoshis(bsv): number{
  let amt = new BigNumber(bsv); 
  let scalar = new BigNumber(100000000);

  return amt.times(scalar).toNumber();
}

