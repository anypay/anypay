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
describe('USDT on AVAX', () => {
    it('#getPayments should accept a txid and return a parsed USDT payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'AVAX', currency: 'USDT' });
        let txid = '0x436b1a4974f8b36ce05fb531c0a9f69c0b419180e450f1454880582373831128';
        let payments = yield plugin.getPayments(txid);
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0x029b705658d7de7c98176f0290cd282a0b9d1486');
        (0, chai_1.expect)(payment.amount).to.be.equal(0.1);
        (0, chai_1.expect)(payment.chain).to.be.equal('AVAX');
        (0, chai_1.expect)(payment.currency).to.be.equal('USDT');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
    it.skip('#parsePayments should accept a raw transaction and return a parsed USDT payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'AVAX', currency: 'USDT' });
        let txid = '0x436b1a4974f8b36ce05fb531c0a9f69c0b419180e450f1454880582373831128';
        let txhex = '';
        let payments = yield plugin.parsePayments({ txhex });
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0x029b705658d7de7c98176f0290cd282a0b9d1486');
        (0, chai_1.expect)(payment.amount).to.be.equal(0.1);
        (0, chai_1.expect)(payment.chain).to.be.equal('AVAX');
        (0, chai_1.expect)(payment.currency).to.be.equal('USDT');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
});
//# sourceMappingURL=usdt_avax_test.js.map