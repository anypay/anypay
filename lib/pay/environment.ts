

export function getBaseURL() {

  if (process.env.API_BASE) {

    return process.env.API_BASE

  } else {

    return process.env.NODE_ENV === 'staging' ? 'https://api.staging.anypayinc.com' : 'https://api.anypayinc.com'
  }

}
