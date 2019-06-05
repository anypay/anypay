const http = require('superagent')

import * as database from './database';

import * as models from './models';

export async function getROI(accountID){

  let account = await models.Account.findOne({ where : { id:accountID }})

  let invoices = (await database.query(`SELECT invoices.currency, sum(invoices.invoice_amount_paid) as crypto_total, sum(invoices.denomination_amount_paid) as fiat_total FROM invoices where denomination_currency='${account.denomination}' and account_id=${account.id} and not status='unpaid' group by currency`))[0]

  let roi = {}
  roi['fiat_value_invoiced'] = 0;
  roi['total_crypto_value'] = 0;
  let cryptoPrice = {}

  for( let i=0; i<invoices.length; i++){
    cryptoPrice[invoices[i].currency] = (await http.get(`api.anypay.global/convert/1-${invoices[i].currency}/to-${account.denomination}`)).body.conversion.output.value
                
  }

  let response = invoices.reduce( (acc, pair)=>{

    acc['fiat_value_invoiced'] = parseFloat(pair.fiat_total) + acc['fiat_value_invoiced']

    acc['total_crypto_value'] = cryptoPrice[pair.currency]*parseFloat(pair.crypto_total) + acc['total_crypto_value']

    acc[`${pair.currency}_value`] = cryptoPrice[pair.currency]*parseFloat(pair.crypto_total)

    acc[`${pair.currency}_roi`] = (cryptoPrice[pair.currency]*parseFloat(pair.crypto_total)/parseFloat(pair.fiat_total)-1) * 100

    return acc

  }, roi)


   roi['percentChange'] = (roi['total_crypto_value']/roi['fiat_value_invoiced']-1) * 100

   roi['currency'] = account.denomination;

   return roi

}
