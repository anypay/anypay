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
require("dotenv").config();
const account_login_1 = require("@/lib/account_login");
const accounts_1 = require("@/lib/accounts");
const utils_1 = require("@test/utils");
describe('Account Login', () => {
    describe("registering an account", () => {
        it('#registerAccount should create a new account', () => __awaiter(void 0, void 0, void 0, function* () {
            let email = utils_1.chance.email();
            let password = utils_1.chance.word();
            let account = yield (0, accounts_1.registerAccount)(email, password);
            (0, utils_1.assert)(account.id > 0);
            utils_1.assert.strictEqual(account.email, email);
        }));
    });
    it("#withEmailPassword should automatically downcase an email", () => __awaiter(void 0, void 0, void 0, function* () {
        let email = utils_1.chance.email();
        let password = utils_1.chance.word();
        let account = yield (0, accounts_1.registerAccount)(email, password);
        let token = yield (0, account_login_1.withEmailPassword)(email.toUpperCase(), password);
        (0, utils_1.assert)(token);
        utils_1.assert.strictEqual(token.account_id, account.id);
        (0, utils_1.assert)(token.id > 0);
    }));
});
//# sourceMappingURL=account_login_test.js.map