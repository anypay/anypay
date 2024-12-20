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
const utils_1 = require("@test/utils");
const invoices_1 = require("@/lib/invoices");
const pay_1 = require("@/lib/pay");
const Events = __importStar(require("@/lib/events"));
class EdgeWallet {
    fetchPaymentRequest(invoice, server) {
        return server.inject({
            method: 'GET',
            url: `/r/${invoice.uid}`,
            headers: this.getHeaders()
        });
    }
    getHeaders(headers = {}) {
        return Object.assign(headers, {
            'x-requested-with': 'co.edgesecure.app'
        });
    }
}
describe('Payment Requests With Edge Wallet', () => {
    var wallet = new EdgeWallet();
    it('requests payments with edge-specific headers', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield (0, invoices_1.createInvoice)({ amount: 0.02, account: utils_1.account });
        let headers = wallet.getHeaders();
        (0, utils_1.expect)(headers['x-requested-with']).to.be.equal('co.edgesecure.app');
        let response = yield wallet.fetchPaymentRequest(invoice, utils_1.server);
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
    }));
    it.skip('should detect and record when Edge requests a payment request', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield (0, invoices_1.createInvoice)({ amount: 0.02, account: utils_1.account });
        utils_1.spy.on(Events, ['recordEvent']);
        (0, utils_1.expect)(Events.recordEvent).to.have.been.called.with({
            invoice_uid: invoice.uid,
            wallet: pay_1.Wallets.Edge
        }, 'invoice.requested');
        let events = yield Events.listEvents('invoice.requested', {
            invoice_uid: invoice.uid,
            wallet: pay_1.Wallets.Edge
        });
        (0, utils_1.expect)(events.length).to.be.equal(1);
        (0, utils_1.expect)(events[0].payload.wallet).to.be.equal(pay_1.Wallets.Edge);
        events = yield Events.listInvoiceEvents(invoice, 'invoice.requested');
        (0, utils_1.expect)(events.length).to.be.equal(1);
    }));
    it.skip('payment-verification step should reject with incorrect number of outputs', () => __awaiter(void 0, void 0, void 0, function* () {
    }));
    it.skip('should detect and record when Edge submits a payment request', () => __awaiter(void 0, void 0, void 0, function* () {
    }));
});
//# sourceMappingURL=edge_wallet_test.js.map