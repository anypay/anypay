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
describe('USDT on ETH', () => {
    it('should find the plugin for ETH', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'ETH', currency: 'USDT' });
        (0, chai_1.expect)(plugin.currency).to.be.equal('USDT');
        (0, chai_1.expect)(plugin.chain).to.be.equal('ETH');
        (0, chai_1.expect)(plugin.decimals).to.be.equal(6);
    }));
    it('#getConfirmation should return block data for confirmed transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'ETH', currency: 'USDT' });
        let txid = '0x52ff131ac073f919981f8d57277bc0ef541dcc191cddbf8f9d59f727e0cd729e';
        let { confirmation_hash, confirmation_height, confirmation_date } = yield plugin.getConfirmation(txid);
        (0, chai_1.expect)(confirmation_hash).to.be.equal('0x11d50922d34f18e662080ff3dd99f6c7cfea86a2fb8d094f33134f2dc658def8');
        (0, chai_1.expect)(confirmation_height).to.be.equal(17263546);
        (0, chai_1.expect)(confirmation_date).to.be.a('date');
    }));
    it('#getPayments should accept a txid and return a parsed USDT payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'ETH', currency: 'USDT' });
        let txid = '0x52ff131ac073f919981f8d57277bc0ef541dcc191cddbf8f9d59f727e0cd729e';
        let payments = yield plugin.getPayments(txid);
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0x39c551cadf430db3198c90786538af8795d544c4');
        (0, chai_1.expect)(payment.amount).to.be.equal(158.550843);
        (0, chai_1.expect)(payment.chain).to.be.equal('ETH');
        (0, chai_1.expect)(payment.currency).to.be.equal('USDT');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
    it('#parsePayments should accept a raw transaction and return a parsed USDT payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'ETH', currency: 'USDT' });
        let txid = '0x52ff131ac073f919981f8d57277bc0ef541dcc191cddbf8f9d59f727e0cd729e';
        let txhex = '0x02f8b30182012a8405f5e100850db659ee2a8301725d94dac17f958d2ee523a2206206994597c13d831ec780b844a9059cbb00000000000000000000000039c551cadf430db3198c90786538af8795d544c40000000000000000000000000000000000000000000000000000000009734b3bc001a0f5fd47ba96c4776c64e42e396c72d96561982f5a4e433631700fcd08bf155d85a052bf989638b43ba5ba58b209e4df4e6720d86b834711a072bbd22279fb284861';
        let payments = yield plugin.parsePayments({ txhex });
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0x39c551cadf430db3198c90786538af8795d544c4');
        (0, chai_1.expect)(payment.amount).to.be.equal(158.550843);
        (0, chai_1.expect)(payment.chain).to.be.equal('ETH');
        (0, chai_1.expect)(payment.currency).to.be.equal('USDT');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
});
//# sourceMappingURL=usdt_eth_test.js.map