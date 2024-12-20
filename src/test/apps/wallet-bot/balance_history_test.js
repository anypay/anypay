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
const wallet_bot_1 = require("@/apps/wallet-bot");
const utils_1 = require("@test/utils");
const scrypt_ts_1 = require("scrypt-ts");
describe("Tracking Wallet Bot Balances", () => {
    it('#getAddressBalanceHistory should show the history of balances for a given address', () => __awaiter(void 0, void 0, void 0, function* () {
        const address = new scrypt_ts_1.bsv.PrivateKey().toAddress().toString();
        const history = yield (0, wallet_bot_1.getAddressHistory)(utils_1.walletBot, {
            address,
            currency: 'USDC',
            chain: 'BSV'
        });
        (0, utils_1.expect)(history.length).to.be.equal(0);
        yield (0, wallet_bot_1.setAddressBalance)(utils_1.walletBot, {
            address,
            balance: 1,
            currency: 'USDC',
            chain: 'BSV'
        });
        (0, utils_1.expect)(history.length).to.be.equal(1);
        yield (0, wallet_bot_1.setAddressBalance)(utils_1.walletBot, {
            address,
            balance: 1,
            currency: 'USDC',
            chain: 'BSV'
        });
        (0, utils_1.expect)(history.length).to.be.equal(1);
        yield (0, wallet_bot_1.setAddressBalance)(utils_1.walletBot, {
            address,
            balance: 0.5,
            currency: 'USDC',
            chain: 'BSV'
        });
        (0, utils_1.expect)(history.length).to.be.equal(2);
    }));
    it('#updateAddressBalance should do nothing if the balance has not changed since the last time', () => __awaiter(void 0, void 0, void 0, function* () {
    }));
    it('#updateAddressBalance should record a new entry when the balance changes', () => __awaiter(void 0, void 0, void 0, function* () {
        const address = new scrypt_ts_1.bsv.PrivateKey().toAddress().toString();
        const [firstEntry, isChanged] = yield (0, wallet_bot_1.setAddressBalance)(utils_1.walletBot, {
            address,
            balance: 1,
            currency: 'USDC',
            chain: 'BSV'
        });
        (0, utils_1.expect)(firstEntry.balance).to.be.equal(1);
        (0, utils_1.expect)(isChanged).to.be.equal(true);
        const [secondEntry, isChanged2] = yield (0, wallet_bot_1.setAddressBalance)(utils_1.walletBot, {
            address,
            balance: 1,
            currency: 'USDC',
            chain: 'BSV'
        });
        (0, utils_1.expect)(secondEntry.balance).to.be.equal(1);
        (0, utils_1.expect)(isChanged2).to.be.equal(false);
        const [thirdEntry, isChanged3] = yield (0, wallet_bot_1.setAddressBalance)(utils_1.walletBot, {
            address,
            balance: 0.5,
            currency: 'USDC',
            chain: 'BSV'
        });
        (0, utils_1.expect)(thirdEntry.difference).to.be.equal(-0.5);
        (0, utils_1.expect)(isChanged3).to.be.equal(true);
    }));
    it('#createPaymentRequest should add webhook_url to the underlying invoice', () => __awaiter(void 0, void 0, void 0, function* () {
    }));
});
//# sourceMappingURL=balance_history_test.js.map