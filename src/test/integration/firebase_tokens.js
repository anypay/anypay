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
describe("Setting Firebase Token via REST", () => __awaiter(void 0, void 0, void 0, function* () {
    it("GET /firebase_token should display the firebase token", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            var token = utils_1.uuid.v4();
            let response = yield utils_1.server.inject({
                method: 'PUT',
                url: '/firebase_token',
                payload: {
                    firebase_token: token
                },
                headers: headers(String(utils_1.accessToken.uid))
            });
            response = yield utils_1.server.inject({
                method: 'GET',
                url: '/firebase_token',
                headers: headers(String(utils_1.accessToken.uid))
            });
            const { result } = response;
            utils_1.assert.strictEqual(result.firebase_token.token, token);
        }
        catch (error) {
            const { message } = error;
            console.error('ERROR', message);
            throw error;
        }
    }));
}));
function auth(username, password) {
    return `Basic ${new Buffer(username + ':' + password).toString('base64')}`;
}
function headers(token) {
    return {
        'Authorization': auth(token, "")
    };
}
//# sourceMappingURL=firebase_tokens.js.map