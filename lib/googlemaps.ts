
import * as events from './events';

require('dotenv').config();

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
});

export async function geocode(address) {

  let resp = await googleMapsClient.geocode({address}).asPromise();

  return resp.json.results[0].geometry.location;

}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export function parseCity(result): AddressComponent {

  return result.address_components.filter(r => {
    return r.types.includes('locality')
  })[0];
}

export function parseCountry(result): AddressComponent {

  return result.address_components.filter(r => {
    return r.types.includes('country')
  })[0];
}

export function parseState(result): AddressComponent {

  return result.address_components.filter(r => {
    return r.types.includes('administrative_area_level_1')
  })[0];
}

export async function geocodeFull(address, account_id?: number) {

  let resp = await googleMapsClient.geocode({address}).asPromise();

  events.record({
    event: 'googlemaps.geocoded',
    payload: {
      address,
      result: resp.json
    },
    account_id
  })

  return resp.json.results[0];

}


