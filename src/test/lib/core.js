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
const core_1 = require("@/lib/core");
const addresses_1 = require("@/lib/addresses");
const assert_1 = __importDefault(require("assert"));
const utils_1 = require("@test/utils");
const prisma_1 = __importDefault(require("@/lib/prisma"));
describe("Anypay Core", () => {
    describe("Updating Account Address", () => {
        it("#setAddress should fail if locked", () => __awaiter(void 0, void 0, void 0, function* () {
            const account = yield (0, utils_1.generateAccount)();
            yield (0, addresses_1.lockAddress)({
                account_id: Number(account === null || account === void 0 ? void 0 : account.id),
                currency: 'DASH',
                chain: 'DASH'
            });
            try {
                yield (0, core_1.setAddress)({
                    account_id: Number(account === null || account === void 0 ? void 0 : account.id),
                    chain: 'DASH',
                    currency: 'DASH',
                    address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
                });
                (0, assert_1.default)(false);
            }
            catch (error) {
                assert_1.default.strictEqual(error.message, `DASH address locked`);
                yield (0, addresses_1.unlockAddress)({
                    account_id: Number(account === null || account === void 0 ? void 0 : account.id),
                    currency: 'DASH',
                    chain: 'DASH'
                });
            }
        }));
        it("setAddress should set a DASH address", () => __awaiter(void 0, void 0, void 0, function* () {
            const account = yield (0, utils_1.generateAccount)();
            let addressChangeset = {
                account_id: account.id,
                currency: 'DASH',
                chain: 'DASH',
                address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
            };
            yield (0, core_1.setAddress)(addressChangeset);
            const address = yield prisma_1.default.addresses.findFirstOrThrow({
                where: {
                    account_id: account.id,
                    currency: 'DASH',
                    chain: 'DASH'
                }
            });
            assert_1.default.strictEqual(address.value, addressChangeset.address);
        }));
        it("setAddress should set a BTC address", () => __awaiter(void 0, void 0, void 0, function* () {
            const account = yield (0, utils_1.generateAccount)();
            let addressChangeset = {
                account_id: account.id,
                currency: 'BTC',
                chain: 'BTC',
                address: '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K'
            };
            yield (0, core_1.setAddress)(addressChangeset);
            const address = yield prisma_1.default.addresses.findFirstOrThrow({
                where: {
                    account_id: account.id,
                    currency: 'BTC',
                    chain: 'BTC'
                }
            });
            assert_1.default.strictEqual(address.value, addressChangeset.address);
        }));
        it("unsetAddress should remove a DASH address", () => __awaiter(void 0, void 0, void 0, function* () {
            const account = yield (0, utils_1.generateAccount)();
            yield (0, core_1.setAddress)({
                account_id: account.id,
                currency: 'DASH',
                chain: 'DASH',
                address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
            });
            yield (0, core_1.unsetAddress)({
                account_id: account.id,
                currency: 'DASH',
                chain: 'DASH',
                address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
            });
            const address = yield prisma_1.default.addresses.findFirstOrThrow({
                where: {
                    account_id: account.id,
                    currency: 'DASH',
                    chain: 'DASH'
                }
            });
            (0, assert_1.default)(!address);
        }));
    });
    describe("Setting A Dynamic Address Not In Hardcoded List", () => {
        it("#setAddress should set a ZEN ZenCash address", () => __awaiter(void 0, void 0, void 0, function* () {
            const account = yield (0, utils_1.generateAccount)();
            yield (0, core_1.setAddress)({
                account_id: account.id,
                currency: 'ZEN',
                address: 'zszpcLB6C5B8QvfDbF2dYWXsrpac5DL9WRk',
                chain: 'ZEN'
            });
            const address = yield prisma_1.default.addresses.findFirstOrThrow({
                where: {
                    account_id: account.id,
                    currency: 'ZEN'
                }
            });
            assert_1.default.strictEqual(address.value, 'zszpcLB6C5B8QvfDbF2dYWXsrpac5DL9WRk');
        }));
        it("#unsetAddress should set a ZEN ZenCash address", () => __awaiter(void 0, void 0, void 0, function* () {
            const account = yield (0, utils_1.generateAccount)();
            yield (0, core_1.unsetAddress)({
                account_id: account.id,
                currency: 'ZEN',
                chain: 'ZEN',
                address: 'zszpcLB6C5B8QvfDbF2dYWXsrpac5DL9WRk'
            });
            const address = yield prisma_1.default.addresses.findFirstOrThrow({
                where: {
                    account_id: account.id,
                    currency: 'ZEN'
                }
            });
            (0, assert_1.default)(!address);
        }));
    });
});
//# sourceMappingURL=core.js.map