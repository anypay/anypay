var SquareConnect = require('square-connect');

import * as uuid from 'uuid';
import * as http from 'superagent';

import { models } from './models';

import { Op } from 'sequelize';

var client = SquareConnect.ApiClient.instance;
// Set sandbox url
client.basePath = 'https://connect.squareupsandbox.com';
// Configure OAuth2 access token for authorization: oauth2
var oauth2 = client.authentications['oauth2'];
// Set sandbox access token
oauth2.accessToken = process.env.SQUARE_OAUTH_ACCESS_TOKEN;

export async function grabAndGoCreateOrder(invoiceUid, locationId="6T8BPZNHR3E0B") { // portsmouth fresh press

  /*
   * Square API requests are authenticated using access tokens granted through an
   * online authorization page. The access tokens are stored in the database for
   * retrieval by account.
   *
   *
   * */

  let invoice = await models.Invoice.findOne({ where: {

    uid: invoiceUid

  }});

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

  let squareClient = await getClient(invoice.account_id);

  console.log('client', squareClient);

  let data:any = await squareClient.createOrder(locationId, body);

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

  async createOrder(locationId: string, order: any) {

    let resp = await http
      .post(`https://connect.squareup.com/v2/locations/${locationId}/orders`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${this.accessToken}`)
      .send(order);

    console.log('resp', resp);

    return resp.body;

  }

}

export async function getClient(accountId) {

  let squareCreds = await models.SquareOauthCredentials.findOne({ where: {

    account_id: accountId,

    access_token: {
      [Op.ne]: null
    }

  }});

  let squareClient = new SquareOauthClient(squareCreds.access_token);

  return squareClient;

}

