
import { database, models, log } from '../../../lib';

import * as moment from 'moment'
import * as Boom from 'boom'

/*

  All meant to be only for sudo users

*/

export async function index(request) {

  try {

    let query = `select invoices.uid, accounts.email, business_name, image_url, account_id, denomination_amount, denomination_currency,
    currency, hash, invoices."createdAt" from invoices join accounts on accounts.id = invoices.account_id where status = 'paid'
    order by "createdAt" desc limit 1000;`

    let result = await database.query(query)

    return {
      payments: result[0]
    }

  } catch(error) {

    log.error(error)

    return Boom.badRequest(error.message)

  }

}

import { handlePaid } from '../../../lib/payment_processor'

export async function create(req, h) {
  console.log('create payment', req.payload)

  let invoice = await models.Invoice.findOne({ where: { uid: req.params.uid }})

  if (!invoice) {
    throw new Error('invoice not found')
  }

  let payment = Object.assign(req.payload, {
    amount: invoice.amount,
    denomination_amount_paid: invoice.denomination_amount
  })

  invoice = await handlePaid(invoice, payment)

  return { invoice }

}

export async function stats(request) {


  try {

    var format = 'YYYY-MM-DD h:mm:ss'

    let now = moment().format(format)

    let yesterday = moment().subtract(1, 'days').format(format)

    let twodaysago = moment().subtract(2, 'days').format(format)

    let lastweek = moment().subtract(1, 'weeks').format(format)

    let twoweeksago = moment().subtract(2, 'weeks').format(format)


    return {
      today: await countTimespan(yesterday, now),
      yesterday: await countTimespan(twodaysago, yesterday),
      week: await countTimespan(lastweek, now),
      lastweek: await countTimespan(twoweeksago, lastweek)
    }
  } catch(error) {

    console.log(error)

    return Boom.badRequest(error)

  }

}

async function countTimespan(start, end) {

  console.log('start', start)
  console.log('end', end)

  let query = `select count(*) from invoices where status = 'paid' and "createdAt" > '${start}' and "createdAt" < '${end}'`

  console.log(query)

  let result = await database.query(query)

  return result[0][0]

}

