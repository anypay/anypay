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
require('dotenv').config();
const utils_1 = require("@test/utils");
const utils = __importStar(require("@test/utils"));
const prisma_1 = __importDefault(require("@/lib/prisma"));
const lib_1 = require("@/lib");
describe("BIP270 Payment Requests", () => {
    describe("BSV", () => {
        it('should return a valid BIP270 payment request', () => __awaiter(void 0, void 0, void 0, function* () {
            let invoice = yield utils.newInvoice({ amount: 0.02, account: utils_1.account });
            let resp = yield utils_1.request
                .get(`/r/${invoice.uid}`);
            (0, utils_1.expect)(resp.body.outputs.length).to.be.greaterThan(0);
            (0, utils_1.expect)(resp.body.outputs[0].amount).to.be.greaterThan(0);
            (0, utils_1.expect)(resp.body.outputs[0].script).to.be.a('string');
            (0, utils_1.expect)(resp.body.paymentUrl).to.be.a('string');
            (0, utils_1.expect)(resp.statusCode).to.be.equal(200);
        }));
        if (!lib_1.config.get('SKIP_E2E_PAYMENTS_TESTS')) {
            it('an invalid payment should be rejected', () => __awaiter(void 0, void 0, void 0, function* () {
                let invoice = yield utils.newInvoice({ amount: 0.02, account: utils_1.account });
                let resp = yield utils_1.request
                    .get(`/r/${invoice.uid}`);
                let transaction = "INVALID";
                (0, utils_1.expect)(transaction).to.be.a('string');
                let url = (() => {
                    let url = resp.body.paymentUrl.replace('undefined', '');
                    let parts = url.split('://')[1].split('/');
                    parts.shift();
                    parts.unshift('/');
                    return parts.join('/');
                })();
                try {
                    let submitResponse = yield utils_1.request.post(url).send({
                        transaction
                    });
                    (0, utils_1.expect)(submitResponse.statusCode).to.be.not.equal(200);
                }
                catch (error) {
                    throw error;
                }
            }));
        }
        /*if (!config.get('SKIP_E2E_PAYMENTS_TESTS')) {
    
          it.skip('should accept a valid payment for a BIP270 payment request', async () => {
    
            let invoice = await utils.newInvoice({ amount: 0.02 })
    
            let resp = await request
              .get(`/r/${invoice.uid}`)
    
            expect(resp.body.outputs.length).to.be.greaterThan(0)
    
            expect(resp.body.outputs[0].amount).to.be.greaterThan(0)
    
            expect(resp.body.outputs[0].script).to.be.a('string')
    
            expect(resp.body.paymentUrl).to.be.a('string')
    
            expect(resp.statusCode).to.be.equal(200)
    
            let transaction = await wallet.buildPayment(resp.body.outputs.map(output => {
              
              let address = new Address(new Script(output.script)).toString()
    
              return {
    
                address,
    
                amount: output.amount
              }
    
            }))
    
            expect(transaction).to.be.a('string')
    
            let url = resp.body.paymentUrl.replace('https://api.anypayx.com', '')
    
            let submitResponse = await request.post(url).send({
              transaction
            })
    
            expect(submitResponse.statusCode).to.be.equal(200)
    
            expect(submitResponse.body.error).to.be.equal(0)
    
            expect(submitResponse.body.payment.transaction).to.be.equal(transaction)
    
            expect(submitResponse.body.memo).to.be.a('string')
    
          })
    
        }*/
        it.skip('should reject payment for an invoice that was cancelled', () => __awaiter(void 0, void 0, void 0, function* () {
            let invoice = yield utils.newInvoice({ amount: 0.02, account: utils_1.account });
            let resp = yield utils_1.request
                .get(`/r/${invoice.uid}`);
            let transaction = "INVALID";
            (0, utils_1.expect)(transaction).to.be.a('string');
            let url = resp.body.paymentUrl.replace('undefined', '');
            yield prisma_1.default.invoices.update({
                where: {
                    id: invoice.id
                },
                data: {
                    cancelled: true
                }
            });
            let submitResponse = yield utils_1.request.post(url).send({
                transaction
            });
            (0, utils_1.expect)(submitResponse.statusCode).to.be.equal(500);
            (0, utils_1.expect)(submitResponse.body.payment.transaction).to.be.equal(transaction);
            (0, utils_1.expect)(submitResponse.body.error).to.be.equal(1);
            (0, utils_1.expect)(submitResponse.body.memo).to.be.equal('Invoice Already Cancelled');
        }));
    });
});
//# sourceMappingURL=bip270_test.js.map