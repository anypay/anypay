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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const lib_1 = require("@/lib");
const lib_2 = require("@/lib");
const accounts_1 = require("@/lib/accounts");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const utils_1 = require("@test/utils");
describe('Addresses Library', () => {
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, lib_1.initialize)();
    }));
    it("should lock and unlock an address", () => __awaiter(void 0, void 0, void 0, function* () {
        let account = yield (0, accounts_1.registerAccount)(utils_1.chance.email(), utils_1.chance.word());
        let currency = 'DASH';
        let chain = 'DASH';
        let address = yield prisma_1.default.addresses.create({
            data: {
                account_id: account.id,
                value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9',
                currency,
                chain,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        (0, utils_1.assert)(address.id > 0);
        (0, utils_1.assert)(!address.locked);
        yield lib_2.addresses.lockAddress({
            account_id: account.id,
            currency,
            chain
        });
        address = yield prisma_1.default.addresses.findFirstOrThrow({
            where: {
                id: address.id
            }
        });
        (0, utils_1.assert)(address.locked);
        yield lib_2.addresses.unlockAddress({
            account_id: account.id,
            currency,
            chain
        });
        address = yield prisma_1.default.addresses.findFirstOrThrow({
            where: {
                id: address.id
            }
        });
        (0, utils_1.assert)(!address.locked);
    }));
});
//# sourceMappingURL=addresses_test.js.map