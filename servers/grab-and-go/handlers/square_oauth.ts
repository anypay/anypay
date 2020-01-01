
export async function authorize(req, h) {

  let url = `https://squareup.com/oauth2/authorize?client_id=${process.env.SQUARE_OAUTH_APPLICATION_ID}&scope=ORDERS_WRITE,ORDERS_READ,ITEMS_READ,MERCHANT_PROFILE_READ,PAYMENTS_WRITE,EMPLOYEES_READ,TIMECARDS_READ`;

  return h.redirect(url);

}

export async function create(req, h) {

  return {};

}

