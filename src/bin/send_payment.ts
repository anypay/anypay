
const address = '13rEBBFC4vhx4ShJUemNkgFxvKtJMt4TDC'

import * as anypay from 'anypay'
require('dotenv').config()

export async function main() {

    const apiKey = process.env['WALLET_BOT_API_KEY']

    console.log('apiKey', apiKey)

    const app = anypay.app({
        apiKey,
    })

let paymentRequest = await app.request([{

    currency: 'BSV',
  
    to: [{
      address,
      amount: 0.01,
      currency: 'USD'
    }]
  
  }], {
  
    webhook_url: 'https://ecommerce.mystore.com/anypay-webhooks',
  
    redirect_url: 'https://mystore.com/checkout-complete/23if3oio',
  
    secret: 'my-shared-secret-for-webhook-verification',
  
    metadata: {
  
      merchantImageUrl: 'https://bico.media/95a49bbd42717a80d6986181a8a9e8ade30fb9284ef0fb81f61a7de6228108d1.jpg'
  
    }
  })

  console.log(paymentRequest)

}

main()