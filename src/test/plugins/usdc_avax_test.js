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
describe('USDC on AVAX', () => {
    it('#getPayments should accept a txid and return a parsed USDC payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'AVAX', currency: 'USDC' });
        let txid = '0x787a63918cab3cdd6470002283697f0cd5374123d690958ea0e534f25a93bd61';
        let payments = yield plugin.getPayments(txid);
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0x029b705658d7de7c98176f0290cd282a0b9d1486');
        (0, chai_1.expect)(payment.amount).to.be.equal(0.1);
        (0, chai_1.expect)(payment.chain).to.be.equal('AVAX');
        (0, chai_1.expect)(payment.currency).to.be.equal('USDC');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
    it.skip('#parsePayments should accept a raw transaction and return a parsed USDC payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'AVAX', currency: 'USDC' });
        let txid = '0x787a63918cab3cdd6470002283697f0cd5374123d690958ea0e534f25a93bd61';
        let txhex = '0x02f8b382a86a808505d21dba008505d21dba0082be2a94b97ef9ef8734c71904d8002f8b6bc66dd9c48a6e80b844a9059cbb0000000000000000000000004dc29377f2ae10bec4c956296aa5ca7de47692a200000000000000000000000000000000000000000000000000000000000003e8c080a0b851b93f9fea4f7a114c4436335ad6beb12a37df774c53481737deaef7d48d0ea010b4b53c2ccf11c2d61cf58f059e7b976b24ad1978ad3a08655082b0c0103771';
        let payments = yield plugin.parsePayments({ txhex });
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0x029b705658d7de7c98176f0290cd282a0b9d1486');
        (0, chai_1.expect)(payment.amount).to.be.equal(0.01);
        (0, chai_1.expect)(payment.chain).to.be.equal('AVAX');
        (0, chai_1.expect)(payment.currency).to.be.equal('USDC');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
});
//# sourceMappingURL=usdc_avax_test.js.map