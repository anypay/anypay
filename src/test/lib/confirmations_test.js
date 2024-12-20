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
const utils_1 = require("@test/utils");
const invoices_1 = require("@/lib/invoices");
const confirmations_1 = require("@/lib/confirmations");
const payments_1 = require("@/lib/payments");
const crypto_1 = require("crypto");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const core_1 = require("@/lib/core");
describe("Confirmations", () => {
    describe('#confirmPayment', () => {
        it.skip('should update the payment with confirmation data', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, core_1.setAddress)({
                account_id: utils_1.account.id,
                chain: 'BSV',
                currency: 'BSV',
                address: '1SbmHpETuDdkLPAaFoY9GqMiHToCwMUNJ'
            });
            let invoice = yield (0, invoices_1.createInvoice)({ amount: 0.52, account: utils_1.account });
            /*const payment_options = await prisma.payment_options.findMany({
              where: {
                invoice_uid: invoice.uid
              }
            })*/
            //console.log(payment_options, 'payment_options')
            let payment = yield (0, payments_1.recordPayment)(invoice, {
                txid: (0, crypto_1.randomBytes)(32).toString('hex'),
                currency: 'BSV',
                txhex: (0, crypto_1.randomBytes)(128).toString('hex')
            });
            const txid = payment.txid;
            const confirmation_hash = (0, crypto_1.randomBytes)(32).toString('hex');
            const confirmation_height = 1000000;
            const confirmation_date = new Date();
            payment = yield prisma_1.default.payments.findFirstOrThrow({
                where: {
                    id: payment.id
                }
            });
            console.log(payment, '2');
            let result = yield (0, confirmations_1.confirmPayment)({
                payment,
                confirmation: {
                    confirmation_hash,
                    confirmation_height,
                    confirmation_date
                }
            });
            console.log('payment.conformed', result);
            payment = yield prisma_1.default.payments.findFirstOrThrow({
                where: {
                    txid
                }
            });
            (0, utils_1.expect)(payment.confirmation_hash).to.be.equal(confirmation_hash);
            (0, utils_1.expect)(payment.confirmation_height).to.be.equal(confirmation_height);
            (0, utils_1.expect)(payment.confirmation_date.toString()).to.be.equal(confirmation_date.toString());
            (0, utils_1.expect)(payment.status).to.be.equal('confirmed');
        }));
    });
    describe('#confirmPaymentByTxid', () => {
        it.skip('should update the invoice and payment accordingly', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, core_1.setAddress)({
                account_id: utils_1.account.id,
                chain: 'BSV',
                currency: 'BSV',
                address: '1SbmHpETuDdkLPAaFoY9GqMiHToCwMUNJ'
            });
            let invoice = yield (0, utils_1.newInvoice)({ amount: 0.52, account: utils_1.account });
            const txid = (0, crypto_1.randomBytes)(32).toString('hex');
            let payment = yield (0, payments_1.recordPayment)(invoice, {
                txid,
                currency: 'BSV',
                txhex: (0, crypto_1.randomBytes)(128).toString('hex')
            });
            yield prisma_1.default.invoices.update({
                where: {
                    id: invoice.id
                },
                data: {
                    hash: txid
                }
            });
            const confirmation_hash = (0, crypto_1.randomBytes)(32).toString('hex');
            const confirmation_height = 100000000;
            const confirmation_date = new Date();
            yield (0, confirmations_1.confirmPaymentByTxid)({
                txid: payment.txid,
                confirmation: {
                    confirmation_hash,
                    confirmation_height,
                    confirmation_date
                }
            });
            payment = yield prisma_1.default.payments.findFirstOrThrow({
                where: {
                    txid
                }
            });
            (0, utils_1.expect)(payment.confirmation_hash).to.be.equal(confirmation_hash);
            (0, utils_1.expect)(payment.confirmation_height).to.be.equal(confirmation_height);
            (0, utils_1.expect)((_a = payment.confirmation_date) === null || _a === void 0 ? void 0 : _a.toString()).to.be.equal(confirmation_date.toString());
        }));
    });
    describe('When EVM Reverts a Transaction', () => {
        it('#revertPayment should mark payment as failed and invoice as unpaid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, core_1.setAddress)({
                account_id: utils_1.account.id,
                chain: 'BSV',
                currency: 'BSV',
                address: '1SbmHpETuDdkLPAaFoY9GqMiHToCwMUNJ'
            });
            let invoice = yield (0, utils_1.newInvoice)({ amount: 0.52, account: utils_1.account });
            const txid = (0, crypto_1.randomBytes)(32).toString('hex');
            const uid = invoice.uid;
            let payment = yield (0, payments_1.recordPayment)(invoice, {
                txid,
                currency: 'BSV',
                txhex: (0, crypto_1.randomBytes)(128).toString('hex')
            });
            yield prisma_1.default.invoices.update({
                where: {
                    id: invoice.id
                },
                data: {
                    hash: txid,
                    status: 'paid'
                }
            });
            yield (0, confirmations_1.revertPayment)({ txid: payment.txid });
            invoice = yield prisma_1.default.invoices.findFirstOrThrow({
                where: {
                    uid
                }
            });
            payment = yield prisma_1.default.payments.findFirstOrThrow({
                where: {
                    txid: payment.txid
                }
            });
            (0, utils_1.expect)(invoice.status).to.be.equal('unpaid');
            (0, utils_1.expect)(invoice.hash).to.be.equal(null);
            (0, utils_1.expect)(payment.status).to.be.equal('failed');
        }));
    });
    describe("Confirming EVM Payments with Web3 Receipt", () => {
        it("should revertPayment when the payment is reverted by the EVM", () => __awaiter(void 0, void 0, void 0, function* () {
        }));
        it("should confirmPayment when the payment arrives in a block", () => __awaiter(void 0, void 0, void 0, function* () {
        }));
    });
});
//# sourceMappingURL=confirmations_test.js.map