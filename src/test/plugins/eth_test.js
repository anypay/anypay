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
const plugins_1 = require("@/lib/plugins");
const chai_1 = require("chai");
describe('ETH', () => {
    it('should find the plugin for ETH', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'ETH', currency: 'ETH' });
        (0, chai_1.expect)(plugin.currency).to.be.equal('ETH');
        (0, chai_1.expect)(plugin.chain).to.be.equal('ETH');
        (0, chai_1.expect)(plugin.decimals).to.be.equal(18);
    }));
    it('#getConfirmation should return block data for confirmed transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'ETH', currency: 'ETH' });
        let txid = '0xcd43123eea81e3b9e2227d6468f6f6ad174e90e6f793b2302c7b03f04604381b';
        let { confirmation_hash, confirmation_height, confirmation_date } = yield plugin.getConfirmation(txid);
        (0, chai_1.expect)(confirmation_hash).to.be.equal('0x5b192061e9a046cb05f7f72f5d71bcca2d53cc7083d3a738163f7e155ec6fa05');
        (0, chai_1.expect)(confirmation_height).to.be.equal(17255716);
        (0, chai_1.expect)(confirmation_date).to.be.a('date');
    }));
    it('#getPayments should accept a txid and return a parsed ETH payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'ETH', currency: 'ETH' });
        let txid = '0xf7078f1e8b8c36a7a6ae8acae6bba345f4447aa221817ccaccb5b57b238e8b75';
        let payments = yield plugin.getPayments(txid);
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0x63fc765a644d31f87a2284fd4bf728c9d767d921');
        (0, chai_1.expect)(payment.amount).to.be.equal(0.01527581);
        (0, chai_1.expect)(payment.chain).to.be.equal('ETH');
        (0, chai_1.expect)(payment.currency).to.be.equal('ETH');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
    it('#parsePayments should accept a raw transaction and return a parsed ETH payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'ETH', currency: 'ETH' });
        let txid = '0xf7078f1e8b8c36a7a6ae8acae6bba345f4447aa221817ccaccb5b57b238e8b75';
        let txhex = '0xf86e8303062285046ee870ba8252089463fc765a644d31f87a2284fd4bf728c9d767d92187364544acb4d4008025a004193d0439037192b7c9ee4e81f30ab97292763c27fbc73244c2f7f54672e42ba05ea478ef2154f89aa3acbbd46917b40149dd5a3d3e52aa45f30332dbd8482a3f';
        let payments = yield plugin.parsePayments({ txhex });
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0x63fc765a644d31f87a2284fd4bf728c9d767d921');
        (0, chai_1.expect)(payment.amount).to.be.equal(0.01527581);
        (0, chai_1.expect)(payment.chain).to.be.equal('ETH');
        (0, chai_1.expect)(payment.currency).to.be.equal('ETH');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
});
//# sourceMappingURL=eth_test.js.map