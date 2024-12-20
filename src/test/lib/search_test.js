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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const prisma_1 = __importDefault(require("@/lib/prisma"));
const search = __importStar(require("@/lib/search"));
const search_1 = require("@/lib/search");
const utils_1 = require("@test/utils");
describe("Search", () => {
    it('#search should call multiple sub-searches', () => __awaiter(void 0, void 0, void 0, function* () {
        utils_1.spy.on(search, 'searchInvoiceExternalId');
        utils_1.spy.on(search, 'searchInvoiceHash');
        utils_1.spy.on(search, 'searchAccountEmail');
        utils_1.spy.on(search, 'searchInvoiceUid');
        yield search.search('12345');
        (0, utils_1.expect)(search_1.searchInvoiceExternalId).to.be.called;
        (0, utils_1.expect)(search_1.searchInvoiceHash).to.be.called;
        (0, utils_1.expect)(search_1.searchAccountEmail).to.be.called;
        (0, utils_1.expect)(search_1.searchInvoiceUid).to.be.called;
    }));
    it('should search for and return an invoice by uid', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield (0, utils_1.newInvoice)({ amount: 5.25, account: utils_1.account });
        const [result] = yield search.search(invoice.uid);
        (0, utils_1.expect)(result.type).to.be.equal('invoice');
        (0, utils_1.expect)(result.value.uid).to.be.equal(invoice.uid);
    }));
    it.skip('should search for and return an invoice by external id', () => __awaiter(void 0, void 0, void 0, function* () {
        const external_id = '12345';
        let invoice = yield (0, utils_1.newInvoice)({ amount: 5.25, account: utils_1.account });
        yield prisma_1.default.invoices.update({
            where: {
                id: invoice.id
            },
            data: {
                external_id
            }
        });
        const [result] = yield search.search(external_id);
        (0, utils_1.expect)(result.type).to.be.equal('invoice');
        (0, utils_1.expect)(result.value.external_id).to.be.equal(external_id);
    }));
    it.skip('should search for and return an invoice by hash', () => __awaiter(void 0, void 0, void 0, function* () {
        const hash = '';
        const [result] = yield search.search(hash);
        (0, utils_1.expect)(result.type).to.be.equal('invoice');
        (0, utils_1.expect)(result.value.hash).to.be.equal(hash);
    }));
    it.skip('should search for and return an account by email', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = '';
        const [result] = yield search.search(email);
        (0, utils_1.expect)(result.type).to.be.equal('account');
        (0, utils_1.expect)(result.value.email).to.be.equal(email);
    }));
});
//# sourceMappingURL=search_test.js.map