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
describe('USDT on MATIC', () => {
    it('should find the plugin for USDT.MATIC', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ currency: 'USDT', chain: 'MATIC' });
        (0, chai_1.expect)(plugin.currency).to.be.equal('USDT');
        (0, chai_1.expect)(plugin.chain).to.be.equal('MATIC');
        (0, chai_1.expect)(plugin.token).to.be.equal('0xc2132d05d31c914a87c6611c10748aeb04b58e8f');
    }));
    it('#getConfirmation should return block data for confirmed transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'MATIC', currency: 'USDT' });
        let txid = '0x7fa214be78f449b5c2ce854688a4244bfa6039971edea30f46ee535636fed0a0';
        let { confirmation_hash, confirmation_height, confirmation_date } = yield plugin.getConfirmation(txid);
        (0, chai_1.expect)(confirmation_hash).to.be.equal('0x01a9acc2827368254847ff96169257db4c756e08647db003c808e99306382df3');
        (0, chai_1.expect)(confirmation_height).to.be.equal(42679642);
        (0, chai_1.expect)(confirmation_date).to.be.a('date');
    }));
    it('#getPayments should accept a txid and return a parsed USDT payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'MATIC', currency: 'USDT' });
        let txid = '0x5782e11dea3d70c638587d5fb23d75d2b2f20aee27a250802d585c854e8a2695';
        let payments = yield plugin.getPayments(txid);
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0xf04386e8cf07c7761c9ee365e392ff275d1ebf55');
        (0, chai_1.expect)(payment.amount).to.be.equal(0.1);
        (0, chai_1.expect)(payment.chain).to.be.equal('MATIC');
        (0, chai_1.expect)(payment.currency).to.be.equal('USDT');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
    it.skip('#parsePayments should accept a raw transaction and return a parsed USDT payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'MATIC', currency: 'USDT' });
        let txid = '0x5782e11dea3d70c638587d5fb23d75d2b2f20aee27a250802d585c854e8a2695';
        let txhex = '0xF04386e8CF07c7761c9ee365E392Ff275D1EBf55';
        let payments = yield plugin.parsePayments({ txhex });
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0xf04386e8cf07c7761c9ee365e392ff275d1ebf55');
        (0, chai_1.expect)(payment.amount).to.be.equal(0.1);
        (0, chai_1.expect)(payment.chain).to.be.equal('MATIC');
        (0, chai_1.expect)(payment.currency).to.be.equal('USDT');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
});
//# sourceMappingURL=usdt_matic_test.js.map