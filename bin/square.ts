#!/usr/bin/env ts-node

require('dotenv').config();
/*

var SquareConnect = require('square-connect');
var defaultClient = SquareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
var oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = process.env.SQUARE_OAUTH_ACCESS_TOKEN;

var apiInstance = new SquareConnect.V1EmployeesApi();

console.log(apiInstance);

var opts = {
  'order': "order_example", // String | The order in which employees are listed in the response, based on their created_at field.      Default value: ASC
  'beginUpdatedAt': "beginUpdatedAt_example", // String | If filtering results by their updated_at field, the beginning of the requested reporting period, in ISO 8601 format
  'endUpdatedAt': "endUpdatedAt_example", // String | If filtering results by there updated_at field, the end of the requested reporting period, in ISO 8601 format.
  'beginCreatedAt': "beginCreatedAt_example", // String | If filtering results by their created_at field, the beginning of the requested reporting period, in ISO 8601 format.
  'endCreatedAt': "endCreatedAt_example", // String | If filtering results by their created_at field, the end of the requested reporting period, in ISO 8601 format.
  'status': "status_example", // String | If provided, the endpoint returns only employee entities with the specified status (ACTIVE or INACTIVE).
  'externalId': "externalId_example", // String | If provided, the endpoint returns only employee entities with the specified external_id.
  'limit': 56, // Number | The maximum integer number of employee entities to return in a single response. Default 100, maximum 200.
  'batchToken': "batchToken_example" // String | A pagination cursor to retrieve the next set of results for your original query to the endpoint.
};
apiInstance.listEmployees({}).then(function(data) {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});
*/

var SquareConnect = require('square-connect');
var client = SquareConnect.ApiClient.instance;
// Set sandbox url
client.basePath = 'https://connect.squareupsandbox.com';
// Configure OAuth2 access token for authorization: oauth2
var oauth2 = client.authentications['oauth2'];
// Set sandbox access token
oauth2.accessToken = "YOUR SANDBOX ACCESS TOKEN";
// Pass client to API
var api = new SquareConnect.LocationsApi();

api.listLocations().then(function(data: any) {
  console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function(error) {
  console.error(error);
});

