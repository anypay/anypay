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
describe('USDC on ETH', () => {
    it('should find the plugin for ETH', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'ETH', currency: 'USDC' });
        (0, chai_1.expect)(plugin.currency).to.be.equal('USDC');
        (0, chai_1.expect)(plugin.chain).to.be.equal('ETH');
        (0, chai_1.expect)(plugin.decimals).to.be.equal(6);
    }));
    it('#getConfirmation should return block data for confirmed transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'ETH', currency: 'USDC' });
        let txid = '0xcd43123eea81e3b9e2227d6468f6f6ad174e90e6f793b2302c7b03f04604381b';
        let { confirmation_hash, confirmation_height, confirmation_date } = yield plugin.getConfirmation(txid);
        (0, chai_1.expect)(confirmation_hash).to.be.equal('0x5b192061e9a046cb05f7f72f5d71bcca2d53cc7083d3a738163f7e155ec6fa05');
        (0, chai_1.expect)(confirmation_height).to.be.equal(17255716);
        (0, chai_1.expect)(confirmation_date).to.be.a('date');
    }));
    it('#getPayments should accept a txid and return a parsed USDC payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'ETH', currency: 'USDC' });
        let txid = '0xa0c9b40b8288159fee100742f796a36bea9468c475454159c82081b9bcffd737';
        let payments = yield plugin.getPayments(txid);
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0x63fc765a644d31f87a2284fd4bf728c9d767d921');
        (0, chai_1.expect)(payment.amount).to.be.equal(5.09827);
        (0, chai_1.expect)(payment.chain).to.be.equal('ETH');
        (0, chai_1.expect)(payment.currency).to.be.equal('USDC');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
    it('#parsePayments should accept a raw transaction and return a parsed USDC payment', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'ETH', currency: 'USDC' });
        let txid = '0xa0c9b40b8288159fee100742f796a36bea9468c475454159c82081b9bcffd737';
        let txhex = '0xf8ad8308f1b7850af16b16008302bf2094a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4880b844a9059cbb00000000000000000000000063fc765a644d31f87a2284fd4bf728c9d767d92100000000000000000000000000000000000000000000000000000000004dcb1e25a09bfc24a2e5068063333d1846203b17567e7651c8d1a3694c9d9e34b4675c2c52a07812262351929c7d17d6ae3304f74041263316f1cd271e1c91c21bdeddb3e23e';
        let payments = yield plugin.parsePayments({ txhex });
        (0, chai_1.expect)(payments.length).to.be.equal(1);
        let payment = payments[0];
        (0, chai_1.expect)(payment.address).to.be.equal('0x63fc765a644d31f87a2284fd4bf728c9d767d921');
        (0, chai_1.expect)(payment.amount).to.be.equal(5.09827);
        (0, chai_1.expect)(payment.chain).to.be.equal('ETH');
        (0, chai_1.expect)(payment.currency).to.be.equal('USDC');
        (0, chai_1.expect)(payment.txid).to.be.equal(txid);
    }));
});
//# sourceMappingURL=usdc_eth_test.js.map