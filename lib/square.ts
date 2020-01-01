var SquareConnect = require('square-connect');

import * as uuid from 'uuid';
import * as http from 'superagent';

import { models } from './models';

var client = SquareConnect.ApiClient.instance;
// Set sandbox url
client.basePath = 'https://connect.squareupsandbox.com';
// Configure OAuth2 access token for authorization: oauth2
var oauth2 = client.authentications['oauth2'];
// Set sandbox access token
oauth2.accessToken = process.env.SQUARE_OAUTH_ACCESS_TOKEN;

export async function grabAndGoCreateOrder(invoiceUid, locationId="6T8BPZNHR3E0B") { // portsmouth fresh press

  let invoice = await models.Invoice.findOne({ where: {

    uid: invoiceUid

  }});

  var api = new SquareConnect.OrdersApi();

  var body = {
    idempotency_key: uuid.v4(),
    order: {
      reference_id: invoiceUid,
      location_id: locationId,
      line_items: [{
        quantity: "1",
        catalog_object_id: invoice.external_id
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

export class SquareOauthClient {

  accessToken: string;

  constructor(accessToken) {

    this.accessToken = accessToken;

  }

  async listLocations() {

    let resp = await http
      .get('https://connect.squareup.com/v2/locations')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${this.accessToken}`)

    return resp.body;

  }

  async getLocation(id) {

    let resp = await http
      .get(`https://connect.squareup.com/v2/locations/${id}`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${this.accessToken}`)

    return resp.body;

  }

  async listOrders(locationId: string) {

    let resp = await http
      .get(`https://connect.squareup.com/v2/locations/${locationId}/orders`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${this.accessToken}`)

    return resp.body;

  }

  async getOrder(id) {

    let resp = await http
      .get(`https://connect.squareup.com/v2/orders/${id}`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${this.accessToken}`)

    return resp.body;

  }

  async listCatalog() {

    let resp = await http
      .get('https://connect.squareup.com/v2/catalog/list')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${this.accessToken}`)

    return resp.body;

  }

  async getCatalogObject(object_id: string) {

    let resp = await http
      .get(`https://connect.squareup.com/v2/catalog/object/${object_id}`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${this.accessToken}`)

    return resp.body;

  }

}

