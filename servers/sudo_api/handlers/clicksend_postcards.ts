import {  sendToGooglePlace } from '../../../lib/clicksend';
import * as Boom from 'boom';

export async function create(req, h) {

  try {

    let response = await sendToGooglePlace(req.payload.google_place_id, [
      "https://s3-ap-southeast-2.amazonaws.com/clicksend-api-downloads/_public/_examples/a5_front.pdf",
      "https://s3-ap-southeast-2.amazonaws.com/clicksend-api-downloads/_public/_examples/a5_back.pdf"
    ]);

    return { response }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

