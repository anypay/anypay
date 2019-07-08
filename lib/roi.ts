const http = require('superagent')

import * as moment from 'moment'

require('dotenv').config()

import * as database from './database';

import * as models from './models';

import {sendEmail} from './email';

import * as requireAll from  'require-all';

const templates = requireAll(`${__dirname}/email/templates`);

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

    acc[`${pair.currency}_invoiced`] = parseFloat(pair.fiat_total)

    acc['total_crypto_value'] = cryptoPrice[pair.currency]*parseFloat(pair.crypto_total) + acc['total_crypto_value']

    acc[`${pair.currency}_value`] = cryptoPrice[pair.currency]*parseFloat(pair.crypto_total)

    acc[`${pair.currency}_roi`] = ((cryptoPrice[pair.currency]*parseFloat(pair.crypto_total)/parseFloat(pair.fiat_total)-1) * 100).toFixed(2)

    return acc

  }, roi)


   roi['percentChange'] = ((roi['total_crypto_value']/roi['fiat_value_invoiced']-1) * 100).toFixed(2)

   roi['currency'] = account.denomination;

   if(roi['percentChange'] >= 0){
     roi['isPositive'] = true;
   }else{
     roi['isPositive'] = false;
   }

   return roi

}

export async function getStartDate(accountId){

  let query = `SELECT cast(date_trunc('day',"createdAt") as date) as start_date from invoices where account_id=${accountId} order by id asc limit 1`

  let start = await database.query(query)

  return moment(start[0][0].start_date).format('MMM YYYY')


}

export async function send_all_roi_email(){

  console.log('send_all')
  let query = `SELECT id FROM accounts`

  let ids = (await database.query(query))[0]

  ids.forEach( elem =>{

    roi_updateEmail(elem.id)

  })

}

export async function roi_updateEmail(accountId) {
  
  let template = templates['roi_update']

  let account = await models.Account.findOne({ where : { id:accountId }})

  let subject = template.subject

  let roi = await roiEmailBody(accountId)

  //Roi is negative 
  if( roi === null ){
     return
  }
        
  let body = template.body
  body = body.replace("ROI_BODY", roi)

  return sendEmail(account.email, subject, body);

}


export async function roiEmailBody(accountId){


  let account = await models.Account.findOne({ where : { id:accountId }})

  let roi = await getROI(accountId)

  let start_date = await getStartDate(accountId)

  let subject = "How is taking bitcoin working out for you? You're going to want to see these numbers."
  
        let body = `You are going to love this: <br><br>Your business started accepting Bitcoin in ${start_date}.  ` 

  let total_fiat_invoiced = roi['fiat_value_invoiced'].toFixed(2)
  let total_crypto_value = roi['total_crypto_value'].toFixed(2)

  body += `Since then, the bitcoin you took in has grown in value ${roi['percentChange']}%!`
        body += `<br><br>Total payments (${account.denomination}): ${total_fiat_invoiced}`
        body += `<br><br>Current value of bitcoins received (${account.denomination}): ${total_crypto_value}` 

  if( !roi['isPositive']){
    return null
  }

  console.log(body)

  return body;

}
