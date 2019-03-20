
require('dotenv').config();

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
});

export async function geocode(address) {

  let resp = await googleMapsClient.geocode({address}).asPromise();

  return resp.json.results[0].geometry.location;

}

