require('dotenv').config()

import { app } from 'anypay'
import { config } from '../../../lib'

const anypay = app('c4d33c90-0932-4019-b65e-3892669ad14b')

console.log(anypay)

export async function create_new_invoice() {

    try {

        /*const request = await anypay.request([{
            currency: 'XMR',
            to: [{
                currency: 'USD',
                amount: 0.052,
                address: '43pmyisY3uteCkEYuUbGinAWe79v4ypu4fRy9AkxoCcXGAGdcpWtNnwKZ6D4XTmMQ7YWwZemDddj1KSiKyaHpWk2TjiCoE9'
            }, {
                currency: 'USD',
                amount: 0.052,
                address: '463jsVqBMm36nf4EM8QEZnPBSFVAoNP1ydfJGbkePR5q53CU3UDjGBGfHDDT2dNowZh1PeqYZbFvjMr1hac2kpaoKGcF2fk'
            }]
        }])*/

        const address = config.get('interval_wallet_bot_bsv_address')

        const template = [{
            currency: 'BSV',
            to: [{
              currency: 'USD',
              amount: 0.052,
              address
            }]
          }]

          console.log(template)

        const request = await anypay.request([{
            currency: 'BSV',
            to: [{
              currency: 'USD',
              amount: 0.052,
              address
            }]
          }])
    
        console.log(request)

    } catch(error) {

        console.error('ERROR', error)

    }

}

if (require.main === module) {

  (async () => {

    await create_new_invoice();
  
    process.exit(0);
  
  })()
  
}
