require('dotenv').config()

import { config } from '../../../lib'
import { call } from '../rpc'

async function main() {

  try {

    let result = await call({
      url: config.get('DASH_RPC_URL'),
      method: 'sendrawtransaction',
      params: [process.argv[2]],
      username: config.get('DASH_RPC_USERNAME'),
      password: config.get('DASH_RPC_PASSWORD')
    })

    console.log(result)

  } catch(error) {

    const { response } = error as any

    console.error('could not sendrawtransaction for rpc1', response.data.error)

  }

}

main()
