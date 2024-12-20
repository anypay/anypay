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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const utils_1 = require("@test/utils");
const prices_1 = require("@/lib/prices");
const prisma_1 = __importDefault(require("@/lib/prisma"));
describe('Getting Prices', () => {
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma_1.default.prices.deleteMany({ where: {} });
    }));
    it('should get and set all fiat currencies in cache', () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma_1.default.prices.deleteMany({ where: {} });
        (0, utils_1.expect)((0, prices_1.convert)({ currency: 'USD', value: 100 }, 'EUR')).to.be.eventually.rejected;
        yield (0, prices_1.setAllFiatPrices)();
        let conversion = yield (0, prices_1.convert)({ currency: 'USD', value: 100 }, 'EUR');
        (0, utils_1.expect)(conversion.value).to.be.greaterThan(0);
        (0, utils_1.expect)(conversion.currency).to.be.equal('EUR');
    }));
    it('should throw error when price is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, utils_1.expect)((0, prices_1.convert)({ currency: 'USD', value: 100 }, 'BCH')).to.be.eventually.rejected;
    }));
});
//# sourceMappingURL=prices_test.js.map