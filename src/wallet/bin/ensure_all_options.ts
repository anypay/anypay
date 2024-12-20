#!/usr/bin/env ts-node

require('dotenv').config()

import axios from 'axios'

const options = [{
  currency:'USDC',
  chain:'MATIC'
},{
  currency:'USDC',
  chain:'ETH'
}, {
  currency:'USDC',
  chain:'AVAX'
}, {
  currency:'USDC',
  chain:'SOL'
},{
  currency:'USDT',
  chain:'MATIC'
},{
  currency:'USDT',
  chain:'ETH'
}, {
  currency:'USDT',
  chain:'AVAX'
}, {
  currency:'USDT',
  chain:'SOL'
}]

export async function main() {

    const url = process.argv[2]

    const { data: response } = await axios.get(url, {
      headers: {
        'accept': 'application/payment-options'
      }
    })

   console.log(response.paymentOptions)

    for (let paymentOption of response.paymentOptions) {

      const { chain, currency } = paymentOption

      const { data } = await axios.post(url, {
        chain, currency
      }, {
        headers: {
          'content-type': 'application/payment-request'
        }
      })

      for (let instruction of data.instructions) {

        for (let output of instruction.outputs) {

          console.log(output)

        }

      }

      console.log(data)
      
    }

    for (let option of options){

      const {chain, currency} = option

      const { data } = await axios.post(url, {
        chain, currency
      }, {
        headers: {
          'content-type': 'application/payment-request'
        }
      })

      console.log(data)

    }
}

main()
