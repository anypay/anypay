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
const utils_1 = require("../utils");
const linked_accounts_1 = require("@/lib/linked_accounts");
describe('lib/linked_accounts', () => {
    it('the default test account should be a Account', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, utils_1.expect)(utils_1.account).to.be.not.equal(null);
        (0, utils_1.expect)(utils_1.account.email).to.be.a('string');
        (0, utils_1.expect)(utils_1.account.denomination).to.be.a('string');
    }));
    it("#listLinkedAccounts should return a list of linked accounts", () => __awaiter(void 0, void 0, void 0, function* () {
        const alice = yield (0, utils_1.generateAccount)();
        const bob = yield (0, utils_1.generateAccount)();
        const { source: alice_source, target: alice_target } = yield (0, linked_accounts_1.listLinkedAccounts)(alice);
        const { source: bob_source, target: bob_target } = yield (0, linked_accounts_1.listLinkedAccounts)(bob);
        (0, utils_1.expect)(alice_source.length).to.be.equal(0);
        (0, utils_1.expect)(alice_target.length).to.be.equal(0);
        (0, utils_1.expect)(bob_source.length).to.be.equal(0);
        (0, utils_1.expect)(bob_target.length).to.be.equal(0);
        yield (0, linked_accounts_1.linkAccount)(alice, {
            email: String(bob.email)
        });
        const { source: alice_source_new, target: alice_target_new } = yield (0, linked_accounts_1.listLinkedAccounts)(alice);
        const { source: bob_source_new, target: bob_target_new } = yield (0, linked_accounts_1.listLinkedAccounts)(bob);
        (0, utils_1.expect)(alice_source_new.length).to.be.equal(1);
        (0, utils_1.expect)(alice_target_new.length).to.be.equal(0);
        (0, utils_1.expect)(bob_source_new.length).to.be.equal(0);
        (0, utils_1.expect)(bob_target_new.length).to.be.equal(1);
    }));
    it("#linkAccount should link one account to another", () => __awaiter(void 0, void 0, void 0, function* () {
        const targetAccount = yield (0, utils_1.generateAccount)();
        const linkedAccount = yield (0, linked_accounts_1.linkAccount)(utils_1.account, {
            email: String(targetAccount.email)
        });
        (0, utils_1.expect)(linkedAccount.source).to.be.equal(utils_1.account.id);
        (0, utils_1.expect)(linkedAccount.target).to.be.equal(targetAccount.id);
    }));
    it("#unlinkAccount should un-link one account from another", () => __awaiter(void 0, void 0, void 0, function* () {
        const targetAccount = yield (0, utils_1.generateAccount)();
        yield (0, linked_accounts_1.linkAccount)(utils_1.account, {
            email: String(targetAccount.email)
        });
        const link = yield (0, linked_accounts_1.getLink)({
            source: utils_1.account.id,
            target: targetAccount.id
        });
        if (!link) {
            throw new Error('Link not found');
        }
        yield (0, linked_accounts_1.unlinkAccount)(utils_1.account, { id: String(link.id) });
    }));
    it("#linkAccount should fail with an invalid email", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, utils_1.expect)((0, linked_accounts_1.linkAccount)(utils_1.account, { email: 'invalid@test.tech ' }))
            .to.be.eventually.rejected;
    }));
});
//# sourceMappingURL=linked_accounts_test.js.map