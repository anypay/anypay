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
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("@test/utils"));
const utils_1 = require("@test/utils");
const payments_1 = require("@/lib/payments");
describe('Payments', () => {
    it('should have exactly one invoice always', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ amount: 0.52, account: utils_1.account });
        let payment = yield (0, payments_1.recordPayment)(invoice, {
            txid: '12345',
            currency: 'BSV',
            txhex: '11111111111'
        });
        (0, utils_1.expect)(payment.invoice_uid).to.be.equal(invoice.uid);
        let invoicePayment = yield (0, payments_1.getPayment)(invoice);
        (0, utils_1.expect)(payment.id).to.be.equal(invoicePayment === null || invoicePayment === void 0 ? void 0 : invoicePayment.id);
    }));
    it('should prevent multiple payments for a single invoice', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ account: utils_1.account, amount: 0.52 });
        let payment = yield (0, payments_1.recordPayment)(invoice, {
            txid: '12345',
            currency: 'BSV',
            txhex: '11111111111',
            txjson: { some: 'json' }
        });
        (0, utils_1.expect)(payment.invoice_uid).to.be.equal(invoice.uid);
        try {
            (0, payments_1.recordPayment)(invoice, {
                txid: '3939399',
                currency: 'BSV',
                txhex: '2222222',
                txjson: { some: 'json' }
            });
            throw new Error();
        }
        catch (error) {
            (0, utils_1.expect)(error).to.be.a('error');
        }
    }));
    it('is created upon successful receipt of payment');
    it('contains txid,currency,outputs,createdAt');
});
//# sourceMappingURL=payments_test.js.map