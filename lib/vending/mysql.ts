require('dotenv').config()

import * as http from 'superagent'

import { logInfo, logError } from '../logger'

export async function query(q: string): Promise<any> {

  logInfo('vending.mysql.query', { query: q })

  try {
  
    let response = await http
      .post('https://api.anypayvending.com/v1/mysql/query')
      .send({ query: q })
      .auth(process.env.SUDO_API_KEY, '')

    logInfo('vending.mysql.query.response', { statusCode: response.statusCode })

    return response.body.result

  } catch(error) {

    logInfo('vending.mysql.query.error', error)

    logError('vending.mysql.query.error', error)

    throw error

  }

}

