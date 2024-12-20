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
const utils = __importStar(require("../utils"));
const utils_1 = require("../utils");
const json_v2_1 = require("@/lib/pay/json_v2");
const log_1 = require("@/lib/log");
//import { ensureInvoice } from '../../lib/invoices'
const lib_1 = require("@/lib");
describe('JSON Payment Protocol V2', () => {
    beforeEach(() => { utils_1.spy.on(log_1.log, 'info'); });
    it('#listPaymentOptions should invoice payment options', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ account: utils_1.account, amount: 5.20 });
        let response = yield json_v2_1.protocol.listPaymentOptions(invoice);
        let validation = json_v2_1.schema.Protocol.PaymentOptions.response.validate(response);
        (0, utils_1.expect)(validation.error).to.be.equal(undefined);
    }));
    it('#getPaymentRequest returns a payment request', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ account: utils_1.account, amount: 5.20 });
        let { paymentOptions } = yield json_v2_1.protocol.listPaymentOptions(invoice);
        let response = yield json_v2_1.protocol.getPaymentRequest(invoice, paymentOptions[0]);
        let validation = json_v2_1.schema.Protocol.PaymentRequest.response.validate(response);
        (0, utils_1.expect)(validation.error).to.be.equal(undefined);
    }));
    it('#getPaymentRequest should reject for unsupported currency', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ account: utils_1.account, amount: 5.20 });
        (0, utils_1.expect)(json_v2_1.protocol.getPaymentRequest(invoice, {
            currency: 'INVALID',
            chain: 'main'
        })).to.be.eventually.rejectedWith('Unsupported Currency or Chain for Payment Option');
    }));
    it.skip('#verifyUnsignedPayment records an event in the invoice event log', () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ account: utils_1.account, amount: 5.20 });
        let { paymentOptions } = yield json_v2_1.protocol.listPaymentOptions(invoice);
        yield json_v2_1.protocol.getPaymentRequest(invoice, paymentOptions[0]);
        let { chain, currency } = paymentOptions[0];
        yield json_v2_1.protocol.verifyUnsignedPayment(invoice, {
            chain,
            currency,
            transactions: [{ txhex: '' }]
        });
        (0, utils_1.expect)(log_1.log.info).to.have.been.called.with('pay.jsonv2.payment-verification');
    }));
    if (lib_1.config.get('run_e2e_payment_tests')) {
        it('#sendSignedPayment should accept and broadcast transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            let invoice = yield utils.newInvoice({ account: utils_1.account, amount: 5.20 });
            let { paymentOptions } = yield json_v2_1.protocol.listPaymentOptions(invoice);
            let { chain, currency } = paymentOptions[0];
            yield json_v2_1.protocol.getPaymentRequest(invoice, { chain, currency });
        }));
        /*
    
        it('#sendSignedPayment should mark invoice as paid', async () => {
    
          let invoice = await utils.newInvoice({ account, amount: 5.20 })
    
          let client = new TestClient(server, `/i/${invoice.uid}`)
    
          let { paymentOptions } = await client.getPaymentOptions()
    
          let paymentOption = paymentOptions.filter((option: any) => {
            return option.currency === 'BSV'
          })[0]
    
          let { chain, currency } = paymentOption
    
          let payment = ''// await wallet.buildPayment(paymentRequest.instructions[0].outputs)
    
          await protocol.sendSignedPayment(invoice, {
    
            chain,
    
            currency,
    
            transactions: [{ txhex: payment }]
    
          })
    
          invoice = await ensureInvoice(invoice.uid)
    
          expect(invoice.status).to.be.equal('paid')
    
        })
    
        */
        it('#sendSignedPayment records an event in the invoice evenet log', () => __awaiter(void 0, void 0, void 0, function* () {
            let invoice = yield utils.newInvoice({ account: utils_1.account, amount: 5.20 });
            let { paymentOptions } = yield json_v2_1.protocol.listPaymentOptions(invoice);
            let { chain, currency } = paymentOptions[0];
            yield json_v2_1.protocol.getPaymentRequest(invoice, { chain, currency });
            yield json_v2_1.protocol.sendSignedPayment(invoice, {
                chain,
                currency,
                transactions: []
            });
            (0, utils_1.expect)(log_1.log.info).to.have.been.called.with('pay.jsonv2.payment');
        }));
    }
});
//# sourceMappingURL=json_v2_test.js.map