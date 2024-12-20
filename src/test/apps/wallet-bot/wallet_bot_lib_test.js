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
const wallet_bot_1 = require("@/apps/wallet-bot");
const invoices_1 = require("@/lib/invoices");
const utils_1 = require("@test/utils");
describe("Wallet Bot Library", () => {
    const address = 'XxarAzZrvZdZfqWPwCqJCK3Fyd2PMg38wy';
    describe("Creating Payment Requests", () => {
        it('#createPaymentRequest should create an invoice with the currency', () => __awaiter(void 0, void 0, void 0, function* () {
            const { invoice_uid } = yield (0, wallet_bot_1.createInvoice)(utils_1.walletBot, {
                template: {
                    currency: 'DASH',
                    to: {
                        currency: 'USD',
                        amount: 52.00,
                        address
                    }
                }
            });
            const invoice = yield (0, invoices_1.ensureInvoice)(String(invoice_uid));
            (0, utils_1.expect)(invoice.currency).to.be.equal('DASH');
        }));
        it('#createPaymentRequest should add webhook_url to the underlying invoice', () => __awaiter(void 0, void 0, void 0, function* () {
            const webhook_url = 'https://webhooks.lol/anypay';
            const { invoice_uid } = yield (0, wallet_bot_1.createInvoice)(utils_1.walletBot, {
                template: {
                    currency: 'DASH',
                    to: {
                        currency: 'USD',
                        amount: 52.00,
                        address
                    }
                },
                options: {
                    webhook_url
                }
            });
            const invoice = yield (0, invoices_1.ensureInvoice)(String(invoice_uid));
            (0, utils_1.expect)(invoice.webhook_url).to.be.equal(webhook_url);
        }));
    });
    describe("Querying Invoices and Payments", () => {
        it("#listUnpaid should return all unpaid invoices", () => __awaiter(void 0, void 0, void 0, function* () {
            const [invoice] = yield (0, wallet_bot_1.listInvoices)(utils_1.walletBot);
            (0, utils_1.expect)(invoice.status).to.be.equal('unpaid');
        }));
        it("#listUnpaid should return only invoices of specified currency", () => __awaiter(void 0, void 0, void 0, function* () {
            const [invoice] = yield (0, wallet_bot_1.listInvoices)(utils_1.walletBot, { currency: 'BSV' });
            (0, utils_1.expect)(invoice.status).to.be.equal('unpaid');
            (0, utils_1.expect)(invoice.currency).to.be.equal('BSV');
        }));
        it("#getInvoice should return the details of an invoice", () => __awaiter(void 0, void 0, void 0, function* () {
            const { invoice_uid } = yield (0, wallet_bot_1.createInvoice)(utils_1.walletBot, {
                template: {
                    currency: 'DASH',
                    to: {
                        currency: 'USD',
                        amount: 52.00,
                        address
                    }
                }
            });
            const invoice = yield (0, wallet_bot_1.getInvoice)(utils_1.walletBot, String(invoice_uid));
            (0, utils_1.expect)(invoice.currency).to.be.equal('DASH');
        }));
        it.skip("#cancelInvoice should cancel an invoice", () => __awaiter(void 0, void 0, void 0, function* () {
            const [invoice] = yield (0, wallet_bot_1.listInvoices)(utils_1.walletBot);
            yield (0, wallet_bot_1.cancelInvoice)(utils_1.walletBot, invoice.uid);
            let cancelled = yield (0, wallet_bot_1.getInvoice)(utils_1.walletBot, invoice.uid);
            (0, utils_1.expect)(cancelled.status).to.be.equal('cancelled');
        }));
        it("#listInvoices should list all invoices by status", () => __awaiter(void 0, void 0, void 0, function* () {
            const invoices = yield (0, wallet_bot_1.listInvoices)(utils_1.walletBot);
            (0, utils_1.expect)(invoices).to.be.an('array');
        }));
    });
});
//# sourceMappingURL=wallet_bot_lib_test.js.map