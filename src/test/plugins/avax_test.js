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
describe('AVAX', () => {
    it('should find the plugin for AVAX', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'AVAX', currency: 'AVAX' });
        (0, chai_1.expect)(plugin.currency).to.be.equal('AVAX');
        (0, chai_1.expect)(plugin.chain).to.be.equal('AVAX');
        (0, chai_1.expect)(plugin.decimals).to.be.equal(18);
    }));
    it('#getConfirmation should return block data for confirmed transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'AVAX', currency: 'AVAX' });
        let txid = '0x08374e97eb817fdbd8eb8eddb6e2f4693436dafbdfb7dd2adb4c07300c7a253e';
        let confirmation = yield plugin.getConfirmation(txid);
        if (!confirmation) {
            throw new Error('No confirmation found');
        }
        (0, chai_1.expect)(confirmation.confirmation_height).to.be.greaterThan(0);
        (0, chai_1.expect)(confirmation.confirmation_hash).to.be.equal('0x195e761cecea1cf5d9faf4540a87b685449439f9df65216536b1dddbd1ec3544');
        (0, chai_1.expect)(confirmation.confirmation_height).to.be.equal(29994194);
        (0, chai_1.expect)(confirmation.confirmation_date).to.be.a('date');
    }));
    it('#getPayments should accept a txid and return a parsed AVAX payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'AVAX', currency: 'AVAX' });
        let txid = '0xb638f12c53631d9e7f26c352af51aa1f52ae496686c954ebf6233802c9d92abd';
        let payments = yield plugin.getPayments(txid);
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0x4da4BCf92ab8160906e5123C52dA6C61A165Adc4');
        (0, chai_1.expect)(payment.amount).to.be.equal(1.1265759);
        (0, chai_1.expect)(payment.chain).to.be.equal('AVAX');
        (0, chai_1.expect)(payment.currency).to.be.equal('AVAX');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
});
//# sourceMappingURL=avax_test.js.map