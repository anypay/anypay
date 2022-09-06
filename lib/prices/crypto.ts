require('dotenv').config();

const http = require('superagent');

export async function getCryptoPrices(base_currency: string) {

  let resp = await http
     .get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest')
     .query({
        start: 1,
        limit: 50,
        convert: base_currency
      })
      .set( 'X-CMC_PRO_API_KEY', process.env.COINMARKETCAP_API_KEY);

  return resp.body.data;

}


