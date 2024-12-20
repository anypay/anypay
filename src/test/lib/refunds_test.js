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
const utils_1 = require("@test/utils");
const log_1 = require("@/lib/log");
const refunds_1 = require("@/lib/refunds");
const uuid = __importStar(require("uuid"));
const crypto_1 = require("crypto");
const prisma_1 = __importDefault(require("@/lib/prisma"));
describe('lib/refunds', () => {
    it.skip('#getRefund should return a Refund for an Invoice given explicit refund address', () => __awaiter(void 0, void 0, void 0, function* () {
        const [account, invoice] = yield (0, utils_1.newAccountWithInvoice)();
        log_1.log.debug('test.account.created', account);
        yield prisma_1.default.invoices.update({
            where: {
                id: invoice.id
            },
            data: {
                status: 'paid',
                invoice_currency: 'DASH',
                denomination_currency: 'USD',
                denomination_amount_paid: 52.00
            }
        });
        try {
            const refund = yield (0, refunds_1.getRefund)(invoice, 'XxarAzZrvZdZfqWPwCqJCK3Fyd2PMg38wy');
            (0, utils_1.expect)(refund.refund_invoice_uid).to.be.a('string');
            (0, utils_1.expect)(refund.status).to.be.equal('unpaid');
            (0, utils_1.expect)(refund.address).to.be.equal('XxarAzZrvZdZfqWPwCqJCK3Fyd2PMg38wy');
            (0, utils_1.expect)(refund.original_invoice_uid).to.be.equal(invoice.uid);
        }
        catch (error) {
            throw error;
        }
    }));
    it.skip('#getRefund should detect the refund address if not explicitly provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const txid = (0, crypto_1.createHash)('sha256').update(uuid.v4(), 'utf8').digest();
        const [account, invoice] = yield (0, utils_1.newAccountWithInvoice)();
        log_1.log.debug('test.account.created', account);
        yield prisma_1.default.invoices.update({
            where: {
                id: invoice.id
            },
            data: {
                status: 'paid',
                invoice_currency: 'BCH',
                denomination_currency: 'USD',
                denomination_amount_paid: '52.00',
                hash: txid.toString()
            }
        });
        const refund = yield (0, refunds_1.getRefund)(invoice);
        (0, utils_1.expect)(refund.refund_invoice_uid).to.be.a('string');
        (0, utils_1.expect)(refund.status).to.be.equal('unpaid');
        (0, utils_1.expect)(refund.address).to.be.equal('bitcoincash:qrk5wv9yyxhs00xt7qwj8u6xm89mar3ucsv2gxessa');
        (0, utils_1.expect)(refund.original_invoice_uid).to.be.equal(invoice.uid);
    }));
    it('#getRefund should reject for an invoice that is not yet paid', () => __awaiter(void 0, void 0, void 0, function* () {
        const [account, invoice] = yield (0, utils_1.newAccountWithInvoice)();
        log_1.log.debug('test.account.created', account);
        (0, utils_1.expect)((0, refunds_1.getRefund)(invoice))
            .to.be.eventually.rejectedWith(refunds_1.RefundErrorInvoiceNotPaid);
    }));
});
//# sourceMappingURL=refunds_test.js.map