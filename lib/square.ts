var SquareConnect = require('square-connect');

import * as uuid from 'uuid';

var client = SquareConnect.ApiClient.instance;
// Set sandbox url
client.basePath = 'https://connect.squareupsandbox.com';
// Configure OAuth2 access token for authorization: oauth2
var oauth2 = client.authentications['oauth2'];
// Set sandbox access token
oauth2.accessToken = process.env.SQUARE_OAUTH_ACCESS_TOKEN;

export async function grabAndGoCreateOrder(invoiceUid, catalogObjectId, locationId="VDT4P5TBDZGE8") {

  var api = new SquareConnect.OrdersApi();

  var body = {
    idempotency_key: uuid.v4(),
    order: {
      reference_id: invoiceUid,
      location_id: locationId,
      line_items: [{
        quantity: "1",
        catalog_object_id: catalogObjectId
      }],
      tenders: [{
        type: "OTHER"
      }],
      state: 'COMPLETED',
      metadata: {
        tender_type: "anypay",
        tender_currency: "BCH"
      }
    },
  }

  let data:any = await api.createOrder(locationId, body);

  return data;

}
