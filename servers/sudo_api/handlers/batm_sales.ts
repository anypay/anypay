
import { Op } from 'sequelize'

import * as Boom from 'boom'

import { models, database } from '../../../lib'
import * as moment from 'moment'

export async function index(req, h) {

  /* 
    Sales For Last Twelve
  */

  var limit = 1000

  if (req.query) {
    limit = req.query.limit || limit
  }

  try {

    let sales = await  models.GeneralbytesSale.findAll({
      where: {
        server_time: {
          [Op.ne]: null
        }
      },
      order: [['server_time', 'DESC']],
      limit
    });

    return { sales }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}


export async function stats(request) {


  try {

    var format = 'YYYY-MM-DD h:mm:ss'

    let now = moment().format(format)

    let yesterday = moment().subtract(1, 'days').format(format)

    let twodaysago = moment().subtract(2, 'days').format(format)

    let lastmonth = moment().subtract(1, 'months').format(format)

    let twomonthsago = moment().subtract(2, 'months').format(format)


    return {
      stats: {
        today: await sumProfit(yesterday, now),
        yesterday: await sumProfit(twodaysago, yesterday),
        month: await sumProfit(lastmonth, now),
        lastmonth: await sumProfit(twomonthsago, lastmonth)
      }
    }

  } catch(error) {

    console.log(error)

    return Boom.badRequest(error)

  }

}


async function sumProfit(start, end) {

  let query = `select sum(expected_profit_value) from generalbytes_sales where "server_time" > '${start}' and "server_time" < '${end}'`

  console.log(query)

  let result = await database.query(query)

  console.log(result)

  return result[0][0]

}

