require('dotenv').config()

import { call } from '../rpc'

async function main() {

  try {

    let result1 = await call({
      url: process.env.dash_rpc_url,
      method: 'getblockcount',
      params: [],
      username: process.env.dash_rpc_username,
      password: process.env.dash_rpc_password
    })

    console.log(result1)

  } catch(error) {

    console.error('could not fetch blockcount for rpc1')

  }

  try {

    let result2 = await call({
      url: process.env.dash_rpc_url_2,
      method: 'getblockcount',
      params: [],
      username: process.env.dash_rpc_username,
      password: process.env.dash_rpc_password
    })

    console.log(result2)

  } catch(error) {

    console.error('could not fetch blockcount for rpc2')

  }

  try {

    let result3 = await call({
      url: process.env.dash_rpc_url_3,
      method: 'getblockcount',
      params: [],
      username: process.env.dash_rpc_username,
      password: process.env.dash_rpc_password
    })

    console.log(result3)

  } catch(error) {

    console.error('could not fetch blockcount for rpc3')

  }



}

main()
