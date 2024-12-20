"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const utils_1 = require("@test/utils");
const plugins_1 = require("@/lib/plugins");
describe("Bitcoin BTC", () => {
    describe("Validation", () => {
        it("should validate legacy account", () => __awaiter(void 0, void 0, void 0, function* () {
            const plugin = yield (0, plugins_1.find)({ currency: 'BTC', chain: 'BTC' });
            let valid = yield plugin.validateAddress('1PCu7YjvmJYg5McWZJh7XPxKF5iFrvFu1j');
            let valid2 = yield plugin.validateAddress('33Z1TN8zxC7aBpLjVrnPKtF7jmihTEAH2s');
            (0, utils_1.expect)(valid).to.be.equal(true);
            (0, utils_1.expect)(valid2).to.be.equal(true);
        }));
        it("should validate bech32 account", () => __awaiter(void 0, void 0, void 0, function* () {
            const plugin = yield (0, plugins_1.find)({ currency: 'BTC', chain: 'BTC' });
            let valid = yield plugin.validateAddress('bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9');
            (0, utils_1.expect)(valid).to.be.equal(true);
        }));
        it("return false on bad input", () => __awaiter(void 0, void 0, void 0, function* () {
            const plugin = yield (0, plugins_1.find)({ currency: 'BTC', chain: 'BTC' });
            let valid = yield plugin.validateAddress('fake');
            (0, utils_1.expect)(valid).to.be.equal(false);
        }));
    });
});
//# sourceMappingURL=bitcoincore_test.js.map