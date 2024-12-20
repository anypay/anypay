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
const invoices_1 = require("@/lib/invoices");
const utils = __importStar(require("@test/utils"));
const utils_1 = require("@test/utils");
describe('Integration | Invoices', () => {
    describe("POST /v1/api/invoices", () => {
        it('creates an invoice with valid access token', () => __awaiter(void 0, void 0, void 0, function* () {
            let [account] = yield utils.createAccountWithAddress();
            let response = yield utils.authRequest(account, {
                method: 'POST',
                url: '/v1/api/invoices',
                payload: {
                    amount: 10
                }
            });
            const invoice = response.result.invoice;
            (0, utils_1.expect)(response.statusCode).to.be.equal(201);
            (0, utils_1.expect)(invoice.uid).to.be.a('string');
            (0, utils_1.expect)(invoice.status).to.be.equal('unpaid');
            (0, utils_1.expect)(invoice.amount).to.be.equal(10);
            (0, utils_1.expect)(invoice.denomination_currency).to.be.equal('USD');
        }));
        it("should include payment options for invoice", () => __awaiter(void 0, void 0, void 0, function* () {
            let [account] = yield utils.createAccountWithAddress();
            let response = yield utils.authRequest(account, {
                method: 'POST',
                url: '/v1/api/invoices',
                payload: {
                    amount: 10
                }
            });
            const result = response.result;
            (0, utils_1.expect)(result.payment_options[0].currency).to.be.equal('BSV');
        }));
    });
    describe("Listing Events Related To Invoice", () => {
        it('gets the invoice events list from the API', () => __awaiter(void 0, void 0, void 0, function* () {
            const invoice = yield (0, invoices_1.createInvoice)({ amount: 10, account: utils_1.account });
            let response = yield utils.authRequest(utils_1.account, {
                method: 'GET',
                url: `/v1/api/invoices/${invoice.uid}/events`
            });
            (0, utils_1.expect)(response.statusCode).to.be.equal(200);
            const result = response.result;
            (0, utils_1.expect)(result.events).to.be.an('array');
        }));
    });
});
//# sourceMappingURL=invoices_test.js.map