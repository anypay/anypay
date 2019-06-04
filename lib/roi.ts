const http = require('superagent')

import * as database from './database';

import * as models from './models';

export async function getROI(accountID){

  let account = await models.Account.findOne({ where : { id:accountID }})


  let invoices = (await database.query(`SELECT invoices.currency, sum(invoices.invoice_amount_paid) as crypto_total, sum(invoices.denomination_amount_paid) as fiat_total FROM invoices where denomination_currency='${account.denomination}' and account_id=${account.id} and not status='unpaid' group by currency`))[0]

  let roi = {}
  roi['invoiced_fiat'] = 0;
  roi['crypto_value'] = 0;
  let cryptoPrice = {}

  for( let i=0; i<invoices.length; i++){
    cryptoPrice[invoices[i].currency] = (await http.get(`api.anypay.global/convert/1-${invoices[i].currency}/to-${account.denomination}`)).body.conversion.output.value
                
  }

  let response = invoices.reduce( (acc, pair)=>{

    acc['invoiced_fiat'] = parseFloat(pair.fiat_total) + acc['invoiced_fiat']

    acc['crypto_value'] = cryptoPrice[pair.currency]*parseFloat(pair.crypto_total) + acc['crypto_value']

    return acc

  }, roi)


   roi['percentChange'] = (roi['crypto_value']/roi['invoiced_fiat']-1) * 100

   return roi

}
