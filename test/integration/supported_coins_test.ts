
import { setAddress} from '../../lib/core';

import { coins, accounts } from "../../lib";

import { assert, server, chance } from '../utils'

describe("Account Coins over HTTP", async () => {
  var accessToken, account;
  
  before(async () => {

    account = await accounts.registerAccount(chance.email(), chance.word());

    accessToken = await accounts.createAccessToken(account.id);

    await setAddress({
      account_id: account.id,
      currency: "DASH",
      address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
    });

    await setAddress({
      account_id: account.id,
      currency: "BTC",
      address: "1FdmEDQHL4p4nyE83Loyz8dJcm7edagn8C"
    });

  });

  it("GET /coins should return list of coins", async () => {
    try {

      let response = await server.inject({
        method: 'GET',
        url: '/coins',
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      });

      assert(response.result.coins);

    } catch(error) {

      console.error('ERROR', error.message);
      throw error;
    }
  });

  describe("Making Coins Unavailable", () => {

    it("coins.deactivateCoin should reflect in the response", async () => {

      await coins.deactivateCoin('DASH');

      let response = await server.inject({
        method: 'GET',
        url: '/coins',
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      });

      let dash = response.result.coins.find(c => c.code === 'DASH');

      assert(dash.unavailable);

    });

    it("coins.activateCoin should reflect in the response", async () => {

      await coins.deactivateCoin('DASH');
      await coins.activateCoin('DASH');

      let response = await server.inject({
        method: 'GET',
        url: '/coins',
        headers: {
          'Authorization': auth(accessToken.uid, "")
        }
      });

      let dash = response.result.coins.find(c => c.code === 'DASH');

      assert(!dash.unavailable);

    });

  });

})

function auth(username, password) {
  return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}

