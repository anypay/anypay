import {expect} from "../../utils";

require('dotenv').config()

import {validateAddress} from '../../../plugins/btc'

describe.only("Bitcoin Plugin", () => {
    it("should validate legacy account", async () => {

        expect(validateAddress('1PCu7YjvmJYg5McWZJh7XPxKF5iFrvFu1j')).to.be.equal(true);
        expect(validateAddress('33Z1TN8zxC7aBpLjVrnPKtF7jmihTEAH2s')).to.be.equal(true);
    })

    it("should validate bech32 account", async () => {
        expect(validateAddress('bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9')).to.be.equal(true);
    })

    it("should throw error on bad input", async () => {
        try {
            validateAddress('fake');

            expect.fail('error was not thrown');
        } catch (e) {
            expect(e.message).to.be.equal('Invalid BTC address');
        }
    })
})

