
import { assert, account, v0AuthRequest } from '../utils'

import { setAddress} from '../../lib/core';

import { coins } from "../../lib";

describe("Account Coins over HTTP", async () => {
  
  before(async () => {

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

      let response = await v0AuthRequest(account, {
        method: 'GET',
        url: '/coins'
      });

      assert(response.result.coins);

    } catch(error) {

      throw error;
    }
  });

  describe("Making Coins Unavailable", () => {

    it("coins.deactivateCoin should reflect in the response", async () => {

      await coins.deactivateCoin('DASH');

      let response = await v0AuthRequest(account, {
        method: 'GET',
        url: '/coins'
      });

      let dash = response.result.coins.find(c => c.code === 'DASH');

      assert(dash.unavailable);

    });

    it("coins.activateCoin should reflect in the response", async () => {

      await coins.deactivateCoin('DASH');
      await coins.activateCoin('DASH');

      let response = await v0AuthRequest(account, {
        method: 'GET',
        url: '/coins'
      });

      let dash = response.result.coins.find(c => c.code === 'DASH');

      assert(!dash.unavailable);

    });

  });

})
