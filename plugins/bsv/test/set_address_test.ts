import { Server } from '../../../servers/rest_api/server';
import * as assert from 'assert';

import * as bsv from 'bsv';

import { database, models } from '../../../lib';

import * as Chance from 'chance';
const chance = new Chance();


describe("Setting a BSV Address", () => {

  var server, accessToken;

  describe("Bitcoin Address", () => {

    describe("Valid Bitcoin Address", () => {

      it("should return an http error", async () => {

        var address = new bsv.PrivateKey().toAddress().toString();

        try {

          let response = await server.inject({
            method: 'PUT',
            url: '/addresses/BSV',
            payload: {
              address
            },
            headers: headers(accessToken)
          });

          assert.strictEqual(response.result.statusCode, 200);

        } catch(error) {

          console.error(error);
          assert(false);

        }

      });


    })

    describe("Inalid Bitcoin Address", () => {

      it("should return an http error", async () => {

        var address = 'someinvalidvalue';

        let response = await server.inject({
          method: 'PUT',
          url: '/addresses/BSV',
          payload: {
            address
          },
          headers: headers(accessToken)
        });

        assert.strictEqual(response.result.statusCode, 500);

        assert.strictEqual(response.result.message, "Invalid BSV Address");

      });

    
    })

  })

  describe("Paymail Address", () => {

    describe("Valid Paymail Address", () => {
    
    })

    describe("Inalid Paymail Address", () => {
    
    })


  })

  describe("Handcash Handle", () => {

    describe("Valid Handcash Handle", () => {
    
    });

    describe("Inalid Handcash Handle", () => {

    });

  });

  before(async () => {

    await database.sync();

    try {
      var account = await models.Account.create({
        email: chance.email()
      })

      accessToken = await models.AccessToken.create({
        account_id: account.id
      })

    } catch(error) {
      console.error('ERROR', error.message);
    }

    server = await Server();

  });

});

function headers(accessToken) {

  return {
    'Authorization': auth(accessToken.uid, "")
  }

}

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}



