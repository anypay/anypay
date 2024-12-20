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
const chai_1 = require("chai");
const plugins_1 = require("@/lib/plugins");
describe('SOL', () => {
    it('should find the plugin for SOL', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'SOL', currency: 'SOL' });
        (0, chai_1.expect)(plugin.currency).to.be.equal('SOL');
        (0, chai_1.expect)(plugin.chain).to.be.equal('SOL');
    }));
    it('#getConfirmation should return block data for confirmed transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'SOL', currency: 'SOL' });
        let txid = 'sva4wpWvkuE2vLeGDHdDdxorYNWVz8p74uyR1i1FnHUudK94hCgh7qKWrRW6hnFaVAFkUQp9AX6jVD5BkuNNFvv';
        let { confirmation_hash, confirmation_height, confirmation_date } = yield plugin.getConfirmation(txid);
        (0, chai_1.expect)(confirmation_hash).to.be.equal('6whs717Kr48RW3j2ocsWrW9BiGkSeLFNfnMXN23WAAHL');
        (0, chai_1.expect)(confirmation_height).to.be.equal(176768846);
        (0, chai_1.expect)(confirmation_date).to.be.a('date');
    }));
    it('#getTransaction should return a transaction from the network in standard format', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'SOL', currency: 'SOL' });
        let txid = 'sva4wpWvkuE2vLeGDHdDdxorYNWVz8p74uyR1i1FnHUudK94hCgh7qKWrRW6hnFaVAFkUQp9AX6jVD5BkuNNFvv';
        let transaction = yield plugin.getTransaction(txid);
        (0, chai_1.expect)(transaction.txid).to.be.equal(txid);
    }));
    it('#getPayments should accept a txid and return a parsed SOL payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'SOL', currency: 'SOL' });
        let txid = '4No4pAMHJECHpCqhjUbxsNniaaVmE9mqPek7APhjDWM1XMSozUcsrzm5UTwPBR3XhJX87NQsfr8awZK2SGfq5X6F';
        let payments = yield plugin.getPayments(txid);
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('8tWSZr2qCUNDtkHbHg1wDiYSAHJSY5pP7f6Vnav7cQDP');
        (0, chai_1.expect)(payment.amount).to.be.equal(0.000995);
        (0, chai_1.expect)(payment.chain).to.be.equal('SOL');
        (0, chai_1.expect)(payment.currency).to.be.equal('SOL');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
    it.skip('#parsePayments should accept a raw transaction and return a parsed SOL payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'SOL', currency: 'SOL' });
        let txid = '4No4pAMHJECHpCqhjUbxsNniaaVmE9mqPek7APhjDWM1XMSozUcsrzm5UTwPBR3XhJX87NQsfr8awZK2SGfq5X6F';
        let txhex = '';
        let payments = yield plugin.parsePayments({ txhex });
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('');
        (0, chai_1.expect)(payment.amount).to.be.equal(0.000995);
        (0, chai_1.expect)(payment.chain).to.be.equal('SOL');
        (0, chai_1.expect)(payment.currency).to.be.equal('SOL');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
});
//# sourceMappingURL=sol_test.js.map