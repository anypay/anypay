
import axios from 'axios'

//const host = `http://localhost:5200`
const host = `https://api.anypayx.com`

export async function main() {


    try {

  const { data: invoiceData } = await axios.post(`${host}/invoices`, {
    amount: 10 
  }, {
    auth: {
      username: config.get('ANYPAY_ACCESS_TOKEN'),
      password: ''
    }
  })

  console.log(invoiceData)

    const { data } = await axios.get(`${host}/i/${invoiceData.uid}`, {
      headers: {
        'accept': 'application/payment-options'
      }
    })

    console.log(data)

    const { data: options } = await axios.post(`${host}/i/${invoiceData.uid}`, {
      currency: 'XMR',
      chain: 'XMR'
    }, {
      headers: {
        'content-type': 'application/payment-request'
      }
    })

    console.log(options)

  } catch(error) {

    console.log(error)

  }

}

main()

