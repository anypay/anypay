
const got = require('got');

export async function lookupAddressFromPhoneNumber(phone: string) {

  if (phone.match(/^\+/)) {
    phone = phone.substring(1);
  }

  let url = `https://pay.cointext.io/p/${phone}/300000`;

  console.log('GET URL', url);

  const response = await got(url, {
    headers: {
      'Accept': 'application/payment-request'
    }
  });

  return JSON.parse(response.body).outputs[0].address;

}

