require('dotenv').config()

import { config } from '../../../lib'
import { call } from '../rpc'

async function main() {

  try {

    let result1 = await call({
      url: config.get('DASH_RPC_URL'),
      method: 'getblockcount',
      params: [],
      username: config.get('DASH_RPC_USERNAME'),
      password: config.get('DASH_RPC_PASSWORD')
    })

    console.log(result1)

  } catch(error) {

    console.error('could not fetch blockcount for rpc1')

  }

}

main()
