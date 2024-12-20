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
const config_1 = require("@/lib/config");
describe("JWT Authentication", () => {
    it('#generateAdminToken should sign a token with admin=true', () => __awaiter(void 0, void 0, void 0, function* () {
        let token = yield (0, jwt_1.generateAdminToken)();
        let legit = yield (0, jwt_1.verifyToken)(token);
        utils_1.assert.strictEqual(legit.admin, true);
        utils_1.assert.strictEqual(legit.aud, `https://${config_1.config.get('DOMAIN')}`);
        utils_1.assert.strictEqual(legit.iss, config_1.config.get('DOMAIN'));
        (0, utils_1.assert)(legit.iat);
        (0, utils_1.assert)(legit.exp);
    }));
    it('#verifyToken should fail on an invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        let token = yield (0, jwt_1.generateAdminToken)();
        let invalidToken = token.substring(0, token.length - 3); // remove last three bytes
        try {
            yield (0, jwt_1.verifyToken)(invalidToken);
            (0, utils_1.assert)(false, 'token should not be verified');
        }
        catch (error) {
            const { message } = error;
            utils_1.assert.strictEqual(message, 'invalid signature');
        }
    }));
});
//# sourceMappingURL=jwt_test.js.map