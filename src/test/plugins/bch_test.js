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
describe("BCH", () => {
    it('should find the plugin for BCH', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'BCH', currency: 'BCH' });
        (0, chai_1.expect)(plugin.currency).to.be.equal('BCH');
        (0, chai_1.expect)(plugin.chain).to.be.equal('BCH');
    }));
    it('#getConfirmation should return block data for confirmed transaction', () => __awaiter(void 0, void 0, void 0, function* () {
        let plugin = yield (0, plugins_1.find)({ chain: 'BCH', currency: 'BCH' });
        let txid = '4e51acd9be7d61955838cf4ec20a294465d612f485c6615c5777b7b52320ba4f';
        let { confirmation_hash, confirmation_height, confirmation_date } = yield plugin.getConfirmation(txid);
        (0, chai_1.expect)(confirmation_hash).to.be.equal('000000000000000002a18e30eb35e7c9d12a5daa9d5ebe840d39e39ca4ac29ce');
        (0, chai_1.expect)(confirmation_height).to.be.equal(792678);
        (0, chai_1.expect)(confirmation_date).to.be.a('date');
    }));
});
//# sourceMappingURL=bch_test.js.map