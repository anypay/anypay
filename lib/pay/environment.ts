

export function getBaseURL() {

  console.log('BASE', process.env.PAY_PROTOCOL_BASE_URL);

  if (process.env.PAY_PROTOCOL_BASE_URL) {

    return process.env.PAY_PROTOCOL_BASE_URL

  } else {

    return process.env.NODE_ENV === 'staging' ? 'https://api.staging.anypayinc.com' : 'https://api.anypayinc.com'
  }

}
