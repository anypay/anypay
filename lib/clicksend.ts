require('dotenv').config();
import * as http from 'superagent';

interface Recipient {
  address_name: string;
  address_line_1: string;
  address_line_2: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
  address_country: string;
  return_address_id?: number;
  custom_string?: string;
}

class ComponetExtractor {

  address_components: any[];

  constructor(address_components) {
    this.address_components = address_components;
  }

  get(address_type, long_short='long_name') {

    let component = this.address_components.find(component => {
      return component['types'][0] === address_type;
    });

    return component[long_short];

  }


}

export async function sendToGooglePlace(place_id, files: string[]) {
  
  let resp = await http
    .get(`https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_PLACES_API_KEY}&place_id=${place_id}`)

  let extractor = new ComponetExtractor(resp.body.result.address_components);

  let recipient = {
    address_name: resp.body.result.name,
    address_line_1: `${extractor.get('street_number')} ${extractor.get('route')}`,
    address_line_2: '',
    address_city: extractor.get('locality'),
    address_state: extractor.get('administrative_area_level_1', 'short_name'),
    address_postal_code: extractor.get('postal_code'),
    address_country: extractor.get('country', 'short_name'),
    custom_string: `google_place_id:${place_id}`
  }

  return sendPostcard(recipient, files);

}

export async function sendPostcard(recipient: Recipient, files: string[]) {

  if (files.length !== 2) {
    throw new Error('must include two files');
  }

  recipient = Object.assign({
    return_address_id: 77260
  }, recipient);

  let resp = http
    .post('https://rest.clicksend.com/v3/post/postcards/send')
    .auth(process.env.CLICKSEND_USERNAME, process.env.CLICKSEND_API_KEY)
    .set('Content-Type', 'application/json')
    .send({
      file_urls: files,
      recipients: [recipient]
    })

  return resp;

}

export async function listReturnAddresses() {

  let resp = http
    .post('https://rest.clicksend.com/v3/post/return-addresses')
    .auth(process.env.CLICKSEND_USERNAME, process.env.CLICKSEND_API_KEY)
    .set('Content-Type', 'application/json')

  return resp;

}

export async function createReturnAddress(recipient: Recipient) {

  let resp = http
    .post('https://rest.clicksend.com/v3/post/return-addresses')
    .auth(process.env.CLICKSEND_USERNAME, process.env.CLICKSEND_API_KEY)
    .set('Content-Type', 'application/json')
    .send(recipient)

  return resp;

}


