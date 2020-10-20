
import * as http from 'superagent'

export async function updateOrder(params) {
  var url, base;

  if (process.env.CLOVER_SANDBOX) {

    base = 'https://sandbox.dev.clover.com'

  } else {

    base = 'https://dev.clover.com'

  }

  let result = await http
    .post(`${base}/v3/merchants/${params.merchantid}/orders/${params.orderid}?access_token=${params.accesstoken}`)
    .send({
      state: 'locked',
      unpaidBalance: 0,
      manualTransaction: true,
      paymentState: 'PAID',
      payType: 'FULL',
      note: 'Paid via Anypay'
    })

  let resp = await createPayment({ order: result.body, accesstoken: params.accesstoken, merchantid: params.merchantid })

  return result.body

}

export async function addTender(params) {
  var base;

  if (process.env.CLOVER_SANDBOX) {

    base = 'https://sandbox.dev.clover.com'

  } else {

    base = 'https://dev.clover.com'

  }
  let url = `${base}/v3/merchants/${params.merchantid}/tenders?access_token=${params.accesstoken}`

  console.log('url', url)

  let result = await  http
    .post(url)
    .send({
      id: 'ANYPAY',
      editable: false,
      opensCashDrawer: false,
      supportsTipping: true,
      enabled: true,
      visible: true,
      instructions: 'Open the Anypay App In Your Clover Device to Collect Payment'
    })

  return result.body

}

export async function listTenders(params) {
  var base;

  if (process.env.CLOVER_SANDBOX) {

    base = 'https://sandbox.dev.clover.com'

  } else {

    base = 'https://dev.clover.com'

  }
  let url = `${base}/v3/merchants/${params.merchantid}/tenders?access_token=${process.env.CLOVER_ACCESS_TOKEN}`

  console.log('url', url)

  try {

    let result = await  http
      .get(url)

    return result.body
  } catch(error) {

    console.log(error)

  }

}

export async function createPayment(params) {
  var url, base;

  if (process.env.CLOVER_SANDBOX) {

    base = 'https://sandbox.dev.clover.com'

  } else {

    base = 'https://dev.clover.com'

  }

  try {

    let result = await  http
      .post(`${base}/v3/merchants/${params.merchantid}/orders/${params.order.id}/payments?access_token=${params.accesstoken}`)
      .send({
        amount: params.order.total,
        order: {
          id: params.order.id
        },
        tender: {
          id: 'EC1CGRQVSXENC'
        }
      })

    return result.body

  } catch(error) {

    console.log('error', error)

  }

}

export async function getOrder(params) {
  var url, base;

  if (process.env.CLOVER_SANDBOX) {

    base = 'https://sandbox.dev.clover.com'

  } else {

    base = 'https://dev.clover.com'

  }

  let result = await  http
    .get(`${base}/v3/merchants/${params.merchantid}/orders/${params.orderid}?access_token=${params.accesstoken}`)

  return result.body

}
