/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

require('dotenv').config()

import { expect } from '../utils'

import { find } from '../../lib/plugins'

import { Plugin } from '../../lib/plugin'

describe("Bitcoin BTC", () => {

  describe("Validation", () => {
    it("should validate legacy account", async () => {

      const plugin: Plugin = await find({ currency: 'BTC', chain: 'BTC' })

      let valid = await plugin.validateAddress('1PCu7YjvmJYg5McWZJh7XPxKF5iFrvFu1j')
      let valid2 = await plugin.validateAddress('33Z1TN8zxC7aBpLjVrnPKtF7jmihTEAH2s')

      expect(valid).to.be.equal(true);
      expect(valid2).to.be.equal(true);
    })

    it("should validate bech32 account", async () => {

      const plugin: Plugin = await find({ currency: 'BTC', chain: 'BTC' })

      let valid = await plugin.validateAddress('bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9')

      expect(valid).to.be.equal(true);

    })

    it("return false on bad input", async () => {

      const plugin: Plugin = await find({ currency: 'BTC', chain: 'BTC' })

      let valid = await plugin.validateAddress('fake');

      expect(valid).to.be.equal(false);

    })

  })

})
