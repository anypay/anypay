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
const utils_1 = require("../utils");
const invoices_1 = require("@/lib/invoices");
const invoice_1 = require("@/lib/invoice");
const apps_1 = require("@/lib/apps");
const invoices_2 = require("@/lib/invoices");
describe('lib/invoices', () => {
    it('should get the account for an invoice', () => __awaiter(void 0, void 0, void 0, function* () {
        const invoice = yield (0, utils_1.newInvoice)({ account: utils_1.account });
        (0, utils_1.expect)(invoice.account_id).to.be.a('number');
        (0, utils_1.expect)(invoice.currency).to.be.a('string');
        (0, utils_1.expect)(invoice.status).to.be.equal('unpaid');
        (0, utils_1.expect)(invoice.webhook_url).to.be.a('string');
    }));
    it('#cancelInvoice should cancel an invoice', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield (0, utils_1.newInvoice)({ account: utils_1.account });
        yield (0, invoices_1.cancelInvoice)(invoice);
        invoice = yield (0, invoices_1.getInvoice)(invoice.uid);
        (0, utils_1.expect)(invoice.status).to.be.equal('cancelled');
    }));
    it('#ensureInvoice should get an invoice', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield (0, utils_1.newInvoice)({ account: utils_1.account });
        invoice = yield (0, invoice_1.ensureInvoice)(invoice.uid);
        (0, utils_1.expect)(invoice.uid).to.be.a('string');
    }));
    it('#ensureInvoice should fail for an invoice invoice', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, utils_1.expect)((0, invoice_1.ensureInvoice)('INVALID'))
            .to.be.eventually.rejected;
    }));
    it('#refreshInvoice should update the invoice options', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield (0, utils_1.newInvoice)({
            account: utils_1.account
        });
        yield (0, invoice_1.refreshInvoice)(invoice.uid);
    }));
    it('#isExpired should determine whether an invoice is expired', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield (0, utils_1.newInvoice)({ account: utils_1.account });
        const expired = yield (0, invoice_1.isExpired)(invoice);
        (0, utils_1.expect)(expired).to.be.false;
    }));
    it("#createEmptyInvoice should create an invoice for an app", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = yield (0, apps_1.createApp)({ account_id: utils_1.account.id, name: '@merchant' });
        const invoice = yield (0, invoice_1.createEmptyInvoice)(app.id, {
            amount: 52.00,
            currency: 'RUB'
        });
        (0, utils_1.expect)(invoice.status).to.be.equal('unpaid');
    }));
    it("#createEmptyInvoice should fail with invalid app id", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, utils_1.expect)((0, invoice_1.createEmptyInvoice)(-1))
            .to.be.eventually.rejected;
    }));
    it('#getPaymentOptions should get the options for an invoice', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield (0, utils_1.newInvoice)({
            account: utils_1.account
        });
        let options = yield (0, invoices_2.getPaymentOptions)(invoice.uid);
        (0, utils_1.expect)(options).to.be.an('array');
    }));
});
//# sourceMappingURL=invoices_test.js.map