
import { models, database } from '../../../lib'

import { BigNumber } from 'bignumber.js'

import * as Boom from 'boom'

import * as moment from 'moment'


export async function index(req, h) {

  /*
    List Gift Card Sales With Estimated Profits

    Current estimate of profit is 1%

  */

  try {

    let account = await models.Account.findOne({ where: { email: 'dashsupport@egifter.com' }})

    let sales = await models.Invoice.findAll({

      where: {
        account_id: account.id,
        status: 'paid'
      },

      order: [['createdAt', 'desc']]
    })

    sales = sales.map(sale => {

      let amount = new BigNumber(sale.denomination_amount_paid)

      return Object.assign(sale, {
        profit: parseFloat(amount.times(0.01).toNumber().toFixed(2))
      })

    })

    return { sales }

  } catch(error) {

    return Boom.badRequest(error.message)

  }

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

  let account = await models.Account.findOne({ where: { email: 'dashsupport@egifter.com' }})

  let query = `select count(*) from invoices where account_id = ${account.id} and status = 'paid' and "createdAt" > '${start}' and "createdAt" < '${end}'`

  console.log(query)

  let counts = await database.query(query)

  query = `select sum(denomination_amount_paid) from invoices where account_id = ${account.id} and status = 'paid' and "createdAt" > '${start}' and "createdAt" < '${end}'`

  let sums = await database.query(query)

  return {
    count: parseInt(counts[0][0].count),
    sum: parseFloat(sums[0][0].sum),
    profit: new BigNumber(sums[0][0].sum).times(0.01).toNumber()
  }

}

