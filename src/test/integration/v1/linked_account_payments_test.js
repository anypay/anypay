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
const jwt_1 = require("@/lib/jwt");
const utils_1 = require("@test/utils");
describe("Linked Account Payments", () => __awaiter(void 0, void 0, void 0, function* () {
    it("GET /v1/api/linked-accounts/{account_id}/payments list payments of linked account", () => __awaiter(void 0, void 0, void 0, function* () {
        const targetAccount = yield (0, utils_1.generateAccount)();
        yield utils_1.server.inject({
            method: 'POST',
            url: '/v1/api/linked-accounts',
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            },
            payload: {
                email: targetAccount.email
            }
        });
        const targetJwt = yield (0, jwt_1.generateAccountToken)({ account_id: targetAccount.id, uid: String(targetAccount.id) });
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: `/v1/api/linked-accounts/${utils_1.account.id}/payments`,
            headers: {
                Authorization: `Bearer ${targetJwt}`
            },
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
    }));
    it("should return unauthorized for missing link", () => __awaiter(void 0, void 0, void 0, function* () {
        const targetAccount = yield (0, utils_1.generateAccount)();
        yield utils_1.server.inject({
            method: 'POST',
            url: '/v1/api/linked-accounts',
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            },
            payload: {
                email: targetAccount.email
            }
        });
        const targetJwt = yield (0, jwt_1.generateAccountToken)({ account_id: targetAccount.id, uid: String(targetAccount.id) });
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: `/v1/api/linked-accounts/7777777/payments`,
            headers: {
                Authorization: `Bearer ${targetJwt}`
            },
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(401);
    }));
}));
//# sourceMappingURL=linked_account_payments_test.js.map