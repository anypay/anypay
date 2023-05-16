require('dotenv').config()

import { expect } from '../utils'

import { find } from '../../lib/plugins'

describe("Bitcoin BTC", () => {
  var plugin;

  before(async () => {

    plugin = await find({ currency: 'BTC', chain: 'BTC' })

  })

  describe("Validation", () => {
    it("should validate legacy account", async () => {

      expect(plugin.validateAddress('1PCu7YjvmJYg5McWZJh7XPxKF5iFrvFu1j')).to.be.equal(true);
      expect(plugin.validateAddress('33Z1TN8zxC7aBpLjVrnPKtF7jmihTEAH2s')).to.be.equal(true);
    })

    it("should validate bech32 account", async () => {
      expect(plugin.validateAddress('bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9')).to.be.equal(true);
    })

    it("should throw error on bad input", async () => {
      try {
        plugin.validateAddress('fake');

        expect.fail('error was not thrown');
      } catch (e) {
        expect(e.message).to.be.equal('Invalid BTC address');
      }
    })

  })
})
