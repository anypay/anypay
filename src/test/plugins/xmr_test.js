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
describe('XMR', () => {
    it('should find the plugin for XMR', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'XMR', currency: 'XMR' });
        (0, chai_1.expect)(plugin.currency).to.be.equal('XMR');
        (0, chai_1.expect)(plugin.chain).to.be.equal('XMR');
        (0, chai_1.expect)(plugin.decimals).to.be.equal(12);
    }));
    it('#getConfirmation should return block data for confirmed transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'XMR', currency: 'XMR' });
        let txid = '58f8df857270cfc783c7dfb5e58c69e8dee5b9113242b52cefc62b4296fbcec3';
        let { confirmation_hash, confirmation_height, confirmation_date } = yield plugin.getConfirmation(txid);
        (0, chai_1.expect)(confirmation_hash).to.be.equal('cc3d8eace4332c99e13aa915c1f7521490c3f91054cfc7500fce6ec58f66c98a');
        (0, chai_1.expect)(confirmation_height).to.be.equal(2885963);
        (0, chai_1.expect)(confirmation_date).to.be.a('date');
    }));
});
//# sourceMappingURL=xmr_test.js.map