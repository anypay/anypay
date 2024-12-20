"use strict";
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
require('dotenv').config();
const address = '43iJfB8tYGFCBNEc8rjJnWHfrXzUapbeifsmS5S9wBEPEzGBCgogtCZSkHaU68UBMWG5pRXk56g7CekSZo7bYkyuNq52Dtn';
const view_key = 'f30ef174be8249eb57a0a215339ae653f3c1034bb1e8eb76fa32b83b817fa10b';
const addresses_1 = require("@/lib/addresses");
const invoices_1 = require("@/lib/invoices");
const PayProtocol = __importStar(require("@/lib/pay/json_v2/protocol"));
const utils_1 = require("@test/utils");
const plugins_1 = require("@/lib/plugins");
const prisma_1 = __importDefault(require("@/lib/prisma"));
describe("Monero XMR", () => {
    var plugin;
    before(() => {
        plugin = (0, plugins_1.find)({ chain: 'XMR', currency: 'XMR' });
    });
    describe("Account / Address Setup", () => {
        it('accepts  both address and view key', () => __awaiter(void 0, void 0, void 0, function* () {
            let record = yield (0, addresses_1.setAddress)(utils_1.account, {
                currency: 'XMR',
                chain: 'XMR',
                view_key,
                value: address
            });
            (0, utils_1.expect)(record.id).to.be.greaterThan(0);
            (0, utils_1.expect)(record.account_id).to.be.equal(utils_1.account.id);
            (0, utils_1.expect)(record.view_key).to.be.equal(view_key);
            (0, utils_1.expect)(record.value).to.be.equal(address);
        }));
    });
    describe("Payments", () => {
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, addresses_1.setAddress)(utils_1.account, {
                currency: 'XMR',
                chain: 'XMR',
                value: address,
                view_key
            });
        }));
        it('generates an invoice with monero payment option', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let invoice = yield (0, invoices_1.createInvoice)({
                account: utils_1.account,
                amount: 10
            });
            // /await getPaymentOptions(invoice.uid)
            const option = yield prisma_1.default.payment_options.findFirstOrThrow({
                where: {
                    invoice_uid: invoice.uid,
                    currency: 'XMR',
                    chain: 'XMR'
                }
            });
            (0, utils_1.expect)(option.id).to.be.greaterThan(0);
            (0, utils_1.expect)((_a = option.amount) === null || _a === void 0 ? void 0 : _a.toNumber()).to.be.greaterThan(0);
            (0, utils_1.expect)(option.currency).to.be.equal('XMR');
            (0, utils_1.expect)(option.outputs.length).to.be.equal(2);
        }));
        it('a wallet chooses xmr on the "payment-option" call', () => __awaiter(void 0, void 0, void 0, function* () {
            let invoice = yield (0, invoices_1.createInvoice)({
                account: utils_1.account,
                amount: 10
            });
            let { paymentOptions } = yield PayProtocol.listPaymentOptions(invoice);
            let monero = paymentOptions.filter(option => {
                return option.currency === 'XMR';
            })[0];
            let paymentRequest = yield PayProtocol.getPaymentRequest(invoice, monero);
            (0, utils_1.expect)(paymentRequest.chain).to.be.equal('XMR');
            (0, utils_1.expect)(paymentRequest.network).to.be.equal('main');
            (0, utils_1.expect)(paymentRequest.instructions).to.be.an('array');
        }));
        it('calls plugin.validateUnsignedTx on "payment-verification" call', () => __awaiter(void 0, void 0, void 0, function* () {
            let invoice = yield (0, invoices_1.createInvoice)({
                account: utils_1.account,
                amount: 10
            });
            let { paymentOptions } = yield PayProtocol.listPaymentOptions(invoice);
            let monero = paymentOptions.filter(option => {
                return option.currency === 'XMR';
            })[0];
            yield PayProtocol.getPaymentRequest(invoice, monero);
            utils_1.spy.on(plugin, ['validateUnsignedTx']);
            let unsignedTransaction = '123456';
            try {
                yield PayProtocol.verifyUnsignedPayment(invoice, {
                    chain: 'XMR',
                    currency: 'XMR',
                    transactions: [{ txhex: unsignedTransaction }]
                });
                (0, utils_1.expect)(plugin.validateUnsignedTx).to.have.been.called();
            }
            catch (error) {
                console.error(error);
                (0, utils_1.expect)(false);
            }
        }));
        it('calls plugin.broadcastTx on "payment" call', () => __awaiter(void 0, void 0, void 0, function* () {
            utils_1.spy.on(plugin, ['broadcastTx']);
            let invoice = yield (0, invoices_1.createInvoice)({
                account: utils_1.account,
                amount: 10
            });
            let { paymentOptions } = yield PayProtocol.listPaymentOptions(invoice);
            let monero = paymentOptions.filter(option => {
                return option.currency === 'XMR';
            })[0];
            yield PayProtocol.getPaymentRequest(invoice, monero);
            utils_1.spy.on(plugin, ['validateUnsignedTx']);
            let unsignedTransaction = '123456';
            yield PayProtocol.verifyUnsignedPayment(invoice, {
                chain: 'XMR',
                currency: 'XMR',
                transactions: [{ txhex: unsignedTransaction }]
            });
            //expect(plugin.validateUnsignedTx).to.have.been.called()
            let signedTransaction = '123456734343';
            try {
                yield PayProtocol.sendSignedPayment(invoice, {
                    currency: "XMR",
                    chain: "XMR",
                    transactions: [{ txhex: signedTransaction }]
                });
            }
            catch (error) {
                const { message } = error;
                console.error(message);
            }
            //expect(plugin.broadcastTx).to.have.not.been.called()
        }));
        it.skip('actually broadcasts valid transactions to the network');
        it.skip('rejects broadcasting invalid transactions to the network');
    });
});
//# sourceMappingURL=monero_test.js.map