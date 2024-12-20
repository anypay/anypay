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
const utils = __importStar(require("../utils"));
const utils_1 = require("../utils");
const events_1 = require("@/lib/events");
const invoices_1 = require("@/lib/invoices");
//@ts-ignore
const payment_protocol_1 = require("payment-protocol");
const scrypt_ts_1 = require("scrypt-ts");
const { Transaction } = scrypt_ts_1.bsv;
const delay_1 = __importDefault(require("delay"));
describe('Invoice Events', () => {
    it('each event should have a list of events associated', () => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield utils.generateAccount();
        let invoice = yield (0, invoices_1.createInvoice)({
            account,
            amount: 10
        });
        let events = yield (0, events_1.listInvoiceEvents)(invoice);
        (0, utils_1.expect)(events).to.be.an('array');
    }));
    it.skip('should have a created event by default upon creation', () => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield utils.generateAccount();
        let invoice = yield (0, invoices_1.createInvoice)({
            account,
            amount: 10
        });
        let events = yield (0, events_1.listInvoiceEvents)(invoice, 'invoice.created');
        const [event] = events;
        (0, utils_1.expect)(event.invoice_uid).to.be.equal(invoice.uid);
        (0, utils_1.expect)(event.type).to.be.equal('invoice.created');
    }));
    it.skip('should have a paid event once paid', () => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield utils.generateAccount();
        let invoice = yield (0, invoices_1.createInvoice)({
            account,
            amount: 10
        });
        let [event] = yield (0, events_1.listInvoiceEvents)(invoice, 'invoice.paid');
        (0, utils_1.expect)(event.invoice_uid).to.be.equal(invoice.uid);
        // pay invoice
        (0, utils_1.expect)(event.type).to.be.equal('invoice.paid');
    }));
    describe("Payment Protocol Events", () => {
        it('has an event for every payment verification request', () => __awaiter(void 0, void 0, void 0, function* () {
            const account = yield utils.generateAccount();
            const invoice = yield utils.newInvoice({ account, amount: 5.25 });
            let events = yield (0, events_1.listInvoiceEvents)(invoice, 'pay.jsonv2.payment-verification');
            (0, utils_1.expect)(events.length).to.be.equal(0);
            let client = new payment_protocol_1.TestClient(utils_1.server, `/i/${invoice.uid}`, {
                headers: {
                    'x-requested-with': 'co.edgesecure.app'
                }
            });
            let { paymentOptions } = yield client.getPaymentOptions();
            yield client.selectPaymentOption(paymentOptions[0]);
            const tx = new Transaction().serialize();
            try {
                yield client.verifyPayment({
                    chain: 'BSV',
                    currency: 'BSV',
                    transactions: [{ tx }]
                });
            }
            catch (error) {
                utils_1.log.debug('client.verifyPayment.error', error);
            }
            events = yield (0, events_1.listInvoiceEvents)(invoice);
            events = yield (0, events_1.listInvoiceEvents)(invoice, 'pay.jsonv2.payment-verification');
            //expect(events[0].get('wallet')).to.be.equal('edge')
            (0, utils_1.expect)(events.length).to.be.equal(1);
        }));
        it.skip('has an event for submission of transaction to network', () => __awaiter(void 0, void 0, void 0, function* () {
            const account = yield utils.generateAccount();
            const invoice = yield utils.newInvoice({ account, amount: 5.25 });
            let events = yield (0, events_1.listInvoiceEvents)(invoice, 'pay.jsonv2.payment.broadcast');
            (0, utils_1.expect)(events.length).to.be.equal(0);
            let client = new payment_protocol_1.TestClient(utils_1.server, `/i/${invoice.uid}`, {
                headers: {
                    'x-requested-with': 'co.edgesecure.app'
                }
            });
            const tx = new Transaction().serialize();
            try {
                yield client.sendPayment({
                    chain: 'BSV',
                    currency: 'BSV',
                    transactions: [{ tx }]
                });
            }
            catch (error) {
                utils_1.log.debug('client.sendPayment.error', error);
            }
            events = yield (0, events_1.listInvoiceEvents)(invoice, 'pay.jsonv2.payment.broadcast');
            (0, utils_1.expect)(events.length).to.be.equal(0);
            events = yield (0, events_1.listInvoiceEvents)(invoice, 'pay.jsonv2.payment.unsigned.verify.error');
            //expect(events[0].wallet).to.be.equal('edge')
        }));
        it.skip('has an event for response from failed transaction broadcast ', () => __awaiter(void 0, void 0, void 0, function* () {
            const account = yield utils.generateAccount();
            let invoice = yield (0, invoices_1.createInvoice)({
                account,
                amount: 0.10
            });
            let client = new payment_protocol_1.TestClient(utils_1.server, `/i/${invoice.uid}`, {
                headers: {
                    'x-requested-with': 'co.edgesecure.app'
                }
            });
            const tx = new Transaction().serialize();
            yield client.sendPayment({
                chain: 'BSV',
                currency: 'BSV',
                transactions: [{ tx }]
            });
            // Simulate failure by the blockchain p2p provider
            let events = yield (0, events_1.listInvoiceEvents)(invoice, 'pay.jsonv2.payment.error');
            yield (0, delay_1.default)(5000);
            (0, utils_1.expect)(events.length).to.be.equal(1);
            //expect(events[0].get('wallet')).to.be.equal('edge')
        }));
    });
});
//# sourceMappingURL=invoice_events_test.js.map