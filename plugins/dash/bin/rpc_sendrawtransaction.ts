require('dotenv').config()

import { call } from '../rpc'

async function main() {

  try {

    let result = await call({
      url: process.env.dash_rpc_url,
      method: 'sendrawtransaction',
      params: [process.argv[2]],
      username: process.env.dash_rpc_username,
      password: process.env.dash_rpc_password
    })

    console.log(result)

  } catch(error) {

    console.error('could not sendrawtransaction for rpc1', error.response.data.error)

  }

}

main()
