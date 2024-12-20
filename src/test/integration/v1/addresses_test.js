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
const utils_1 = require("@test/utils");
describe("Setting Addresses Via REST", () => __awaiter(void 0, void 0, void 0, function* () {
    it('V1', () => __awaiter(void 0, void 0, void 0, function* () {
        var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';
        var response = yield utils_1.server.inject({
            method: 'get',
            url: '/v1/api/account/addresses',
            payload: {
                address: address
            },
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            }
        });
        var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';
        const address2 = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';
        yield utils_1.server.inject({
            method: 'post',
            url: '/v1/api/account/addresses',
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            },
            payload: {
                address: address,
                currency: "BTC"
            }
        });
        response = yield utils_1.server.inject({
            method: 'get',
            url: '/v1/api/account/addresses',
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            },
        });
        var response = yield utils_1.server.inject({
            method: 'post',
            url: '/v1/api/account/addresses',
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            },
            payload: {
                address: address2,
                currency: 'BTC'
            }
        });
        response = yield utils_1.server.inject({
            method: 'get',
            url: '/v1/api/account/addresses',
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            },
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
    }));
    it("POST /v1/api/account/addresses should set an address", () => __awaiter(void 0, void 0, void 0, function* () {
        yield utils_1.server.inject({
            method: 'post',
            url: '/v1/api/account/addresses',
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            },
            payload: {
                value: '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K',
                currency: 'BSV'
            }
        });
    }));
    it("DELETE /v1/api/account/addresses should remove an address", () => __awaiter(void 0, void 0, void 0, function* () {
        yield utils_1.server.inject({
            method: 'post',
            url: '/v1/api/account/addresses',
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            },
            payload: {
                value: '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K',
                currency: 'BSV'
            }
        });
        yield utils_1.server.inject({
            method: 'delete',
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            },
            url: `/v1/api/account/addresses/BSV`
        });
    }));
}));
//# sourceMappingURL=addresses_test.js.map