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
const core_1 = require("@/lib/core");
const lib_1 = require("@/lib");
const utils_1 = require("@test/utils");
describe("Account Coins over HTTP", () => __awaiter(void 0, void 0, void 0, function* () {
    var accessToken, account;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        account = yield lib_1.accounts.registerAccount(utils_1.chance.email(), utils_1.chance.word());
        accessToken = yield lib_1.accounts.createAccessToken(account.id);
        yield (0, core_1.setAddress)({
            account_id: account.id,
            currency: "DASH",
            chain: "DASH",
            address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
        });
        yield (0, core_1.setAddress)({
            account_id: account.id,
            currency: "BTC",
            chain: "BTC",
            address: "1FdmEDQHL4p4nyE83Loyz8dJcm7edagn8C"
        });
    }));
    it("GET /coins should return list of coins", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let response = yield utils_1.server.inject({
                method: 'GET',
                url: '/coins',
                headers: {
                    'Authorization': auth(String(accessToken === null || accessToken === void 0 ? void 0 : accessToken.uid), "")
                }
            });
            (0, utils_1.assert)(response.result.coins);
        }
        catch (error) {
            throw error;
        }
    }));
    describe("Making Coins Unavailable", () => {
        it("coins.deactivateCoin should reflect in the response", () => __awaiter(void 0, void 0, void 0, function* () {
            yield lib_1.coins.deactivateCoin('DASH');
            let response = yield utils_1.server.inject({
                method: 'GET',
                url: '/coins',
                headers: {
                    'Authorization': auth(String(accessToken === null || accessToken === void 0 ? void 0 : accessToken.uid), "")
                }
            });
            let dash = response.result.coins.find((c) => c.code === 'DASH');
            (0, utils_1.assert)(dash.unavailable);
        }));
        it("coins.activateCoin should reflect in the response", () => __awaiter(void 0, void 0, void 0, function* () {
            yield lib_1.coins.deactivateCoin('DASH');
            yield lib_1.coins.activateCoin('DASH');
            let response = yield utils_1.server.inject({
                method: 'GET',
                url: '/coins',
                headers: {
                    'Authorization': auth(String(accessToken === null || accessToken === void 0 ? void 0 : accessToken.uid), "")
                }
            });
            let dash = response.result.coins.find((c) => c.code === 'DASH');
            (0, utils_1.assert)(!dash.unavailable);
        }));
    });
}));
function auth(username, password) {
    return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}
//# sourceMappingURL=supported_coins_test.js.map