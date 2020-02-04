const log = require("winston");
const http = require("superagent");

const SLACK_URL = 'https://hooks.slack.com/services/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';

export async function publishEventToSlack(message: string) {

  if (process.env.NODE_ENV === 'production') {

    await http
      .post(SLACK_URL)
      .send({
        text: message
      })
  }
}

export async function publishRabbi(message: string) {

  let url =
  'https://chat.anypay.global/hooks/aLfLzb4YwwgmEQ96r/PoLSobBt6iqnCPQj4dW9MpBb5Cwmxvj7NNdQof72pSP6x6Wt';


  let result = await http
    .post(url)
    .send({
      text: message
    })

  return result.response;
}

