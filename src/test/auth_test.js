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
const registration_1 = require("@/lib/accounts/registration");
//import { passwordResetEmail } from '../lib/password_reset'
//import { chance, expect, spy } from './utils'
const utils_1 = require("@test/utils");
describe("User Authentication", () => {
    it("register account should prevent duplicate accounts", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = utils_1.chance.email();
        const password = utils_1.chance.word();
        let account = yield (0, registration_1.registerAccount)({ email, password });
        (0, utils_1.expect)(account.email).to.be.equal(email);
        (0, utils_1.expect)((0, registration_1.registerAccount)({ email, password }))
            .to.be.eventually.rejectedWith(`account with email ${email} already registered`);
        (0, utils_1.expect)((0, registration_1.registerAccount)({ email, password }))
            .to.be.eventually.rejectedWith(new registration_1.AccountAlreadyRegisteredError(email));
    }));
    it("should log in account and register the login attempt", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = utils_1.chance.email();
        const password = utils_1.chance.word();
        yield (0, registration_1.registerAccount)({ email, password });
        let account = yield (0, registration_1.loginAccount)({ email, password });
        (0, utils_1.expect)(account.email).to.be.equal(email);
        (0, utils_1.expect)(account.id).to.be.greaterThan(0);
    }));
    it.skip("should send password reset email", () => __awaiter(void 0, void 0, void 0, function* () {
        /*const email = chance.email();
    
        const password = chance.word();
    
        await registerAccount({ email, password })
    
        spy.on(ses, 'sendEmail')
    
        let passwordReset = await passwordResetEmail(email)
    
        expect(passwordReset.get('email')).to.be.equal(email)
    
        expect(passwordReset.get('id')).to.be.greaterThan(0)
    
        expect(ses.sendEmail).to.have.been.called()
        */
    }));
});
//# sourceMappingURL=auth_test.js.map