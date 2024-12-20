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
const json_v2_1 = require("@/lib/pay/json_v2");
//@ts-ignore
const bch = __importStar(require("bitcore-lib-cash"));
const config_1 = require("@/lib/config");
describe("JSON Payment Protocol V2", () => __awaiter(void 0, void 0, void 0, function* () {
    it.skip("GET /i/:uid requires accept and x-paypro-2 headers", () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ amount: 0.02, account: utils_1.account });
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: `/i/${invoice.uid}`
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(400);
    }));
    it("GET /i/:uid returns payment options for invoice", () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ amount: 0.02, account: utils_1.account });
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: `/i/${invoice.uid}`,
            headers: {
                'Accept': 'application/payment-options',
                'x-paypro-version': 2
            }
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
        let valid = json_v2_1.schema.Protocol.PaymentOptions.response.validate(response.result);
        (0, utils_1.expect)(valid.error).to.be.equal(undefined);
    }));
    it("GET /r/:uid returns payment options for invoice", () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ amount: 0.02, account: utils_1.account });
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: `/r/${invoice.uid}`,
            headers: {
                'Accept': 'application/payment-options',
                'x-paypro-version': 2
            }
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
        let valid = json_v2_1.schema.Protocol.PaymentOptions.response.validate(response.result);
        (0, utils_1.expect)(valid.error).to.be.equal(undefined);
    }));
    it("POST /i/:uid requires Content-Type and x-paypro-version", () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ amount: 0.02, account: utils_1.account });
        let { result } = yield utils_1.server.inject({
            method: 'GET',
            url: `/i/${invoice.uid}`,
            headers: {
                'Accept': 'application/payment-options',
                'x-paypro-version': 2
            }
        });
        var response = yield utils_1.server.inject({
            method: 'POST',
            url: `/i/${invoice.uid}`
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(400);
        response = yield utils_1.server.inject({
            method: 'POST',
            url: `/i/${invoice.uid}`,
            headers: {
                'Content-Type': 'application/payment-request'
            }
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(400);
        response = yield utils_1.server.inject({
            method: 'POST',
            url: `/i/${invoice.uid}`,
            headers: {
                'content-type': 'application/payment-request',
                'x-paypro-version': 2
            },
            payload: result.paymentOptions[0]
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
    }));
    it("POST /i/:uid returns a payment request for chosen option", () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ amount: 0.02, account: utils_1.account });
        let { result } = yield utils_1.server.inject({
            method: 'GET',
            url: `/i/${invoice.uid}`,
            headers: {
                'Accept': 'application/payment-options',
                'x-paypro-version': 2
            }
        });
        let response = yield utils_1.server.inject({
            method: 'POST',
            url: `/i/${invoice.uid}`,
            headers: {
                'x-paypro-version': 2,
                'Content-Type': 'application/payment-request'
            },
            payload: result.paymentOptions[0]
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
        let valid = json_v2_1.schema.Protocol.PaymentRequest.response.validate(response.result);
        (0, utils_1.expect)(valid.error).to.be.equal(undefined);
    }));
    it("POST /r/:uid returns a payment request for chosen option", () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ amount: 0.02, account: utils_1.account });
        let { result } = yield utils_1.server.inject({
            method: 'GET',
            url: `/r/${invoice.uid}`,
            headers: {
                'Accept': 'application/payment-options',
                'x-paypro-version': 2
            }
        });
        let response = yield utils_1.server.inject({
            method: 'POST',
            url: `/r/${invoice.uid}`,
            headers: {
                'x-paypro-version': 2,
                'Content-Type': 'application/payment-request'
            },
            payload: result.paymentOptions[0]
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
        let valid = json_v2_1.schema.Protocol.PaymentRequest.response.validate(response.result);
        (0, utils_1.expect)(valid.error).to.be.equal(undefined);
    }));
    it.skip("POST /i/:uid signs the payload with headers", () => __awaiter(void 0, void 0, void 0, function* () {
        let account = yield utils.generateAccount();
        let invoice = yield utils.newInvoice({ amount: 0.02, account });
        let response = yield utils_1.server.inject({
            method: 'POST',
            url: `/i/${invoice.uid}`
        });
        (0, utils_1.expect)(response.headers['digest']).to.be.a('string');
        (0, utils_1.expect)(response.headers['x-identity']).to.be.a('string');
        (0, utils_1.expect)(response.headers['x-signature-type']).to.be.a('string');
        (0, utils_1.expect)(response.headers['x-signature']).to.be.a('string');
    }));
    it("POST /i/:uid should rejects invalid un-signed transaction upon payment verification", () => __awaiter(void 0, void 0, void 0, function* () {
        let invoice = yield utils.newInvoice({ amount: 0.02, account: utils_1.account });
        const transaction = new bch.Transaction();
        let response = yield utils_1.server.inject({
            method: 'POST',
            url: `/i/${invoice.uid}`,
            headers: {
                'x-paypro-version': 2,
                'Content-Type': 'application/payment-verification'
            },
            payload: {
                chain: 'BCH',
                currency: 'BCH',
                transactions: [{
                        tx: transaction.serialize()
                    }]
            }
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(400);
    }));
    if (config_1.config.get('run_e2e_payment_tests')) {
        it("POST /i/:uid should verify the payment is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            let invoice = yield utils.newInvoice({ amount: 0.02, account: utils_1.account });
            let response = yield utils_1.server.inject({
                method: 'POST',
                url: `/i/${invoice.uid}`,
                headers: {
                    'x-paypro-version': 2,
                    'Content-Type': 'application/payment-verification'
                }
            });
            json_v2_1.schema.Protocol.PaymentVerification.response.validate(response.result);
        }));
        it("POST /r/:uid should verify the payment is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            let invoice = yield utils.newInvoice({ amount: 0.02, account: utils_1.account });
            let response = yield utils_1.server.inject({
                method: 'POST',
                url: `/r/${invoice.uid}`,
                headers: {
                    'x-paypro-version': 2,
                    'Content-Type': 'application/payment-verification'
                }
            });
            json_v2_1.schema.Protocol.PaymentVerification.response.validate(response.result);
        }));
        /*
    
        it("POST /i/:uid should mark the invoice as paid", async () => {
    
          let account = await utils.generateAccount()
    
          let invoice = await utils.newInvoice({ amount: 0.02, account })
    
          let client = new TestClient(server, `/i/${invoice.uid}`)
    
          let { paymentOptions } = await client.getPaymentOptions()
    
          let paymentOption = paymentOptions.filter(option => {
            return option.currency === 'BSV'
          })[0]
    
          let paymentRequest = await client.selectPaymentOption(paymentOption)
    
          let payment = await wallet.buildPayment(paymentRequest.instructions[0].outputs)
    
          let response = await server.inject({
            method: 'POST',
            url: `/i/${invoice.uid}`,
            headers: {
              'x-paypro-version': 2,
              'Content-Type': 'application/payment'
            },
            payload: {
              transactions: [{ tx: payment }],
              chain: 'BSV',
              currency: 'BSV'
            }
          })
    
          expect(response.statusCode).to.be.equal(200)
    
          schema.Protocol.Payment.response.validate(response.result)
    
          invoice = await ensureInvoice(invoice.uid)
    
          expect(invoice.get('status')).to.be.equal('paid')
    
        })
    
        */
    }
}));
//# sourceMappingURL=json_v2_test.js.map