
/*

  Square Authorization Workflow

  To make business managers most comfortable we likely want to only ask for
  the exact information we need.

  To begin they will visit Anypay and click "Sign in with Square" to authorize
  connect their Anypay account to their Square account. 

  We will request only the MERCHANT_PROFILE_READ scope for this initialize auth-
  orization. Upon successful return from square we will conenct the account if
  it is not already connected, then return an access token.

  Several cases exist when clicks sign in with Square. It is possible they do
  not have an Anypay account yet and have only now visited our website for the 
  first time and are authenticating with Square.

  Initial States:

    - Anypay Account (yes/no)

    - Anypay Access Token (yes/no) meaning the manager is signed in to Anypay.

    - Square Account Connected (yes/no)

  What we know based on initial states:

    - In the case that an Anypay Access Token exists so does an Anypay Account.
    - In the case that an Square Account exists so does an Anypay Account.
    - In the case of no Anypay Access Token we must check for an Anypay Account.
    - In the case of no Anypay Account we must create one.
    - In the case of an Account but no Anypay Access Token we must one.
    - In the case of an Access Token but no Square Account we must create one.

  Once an authorization from Square is granted Anypay connects the Square
  account following the rules above as a guideline. It prompts the user to
  provide information such as login or registration details as needed.

*/

export async function authorize(req, h) {

  let url = `https://squareup.com/oauth2/authorize?client_id=${process.env.SQUARE_OAUTH_APPLICATION_ID}&scope=ORDERS_WRITE,ORDERS_READ,ITEMS_READ,MERCHANT_PROFILE_READ,PAYMENTS_WRITE,EMPLOYEES_READ,TIMECARDS_READ`;

  return h.redirect(url);

}

export async function create(req, h) {

  return {};

}

