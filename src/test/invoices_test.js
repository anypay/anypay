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
const invoices_1 = require("@/lib/invoices");
describe("Generating Invoices", () => {
    it("should require an account and amount at minimum");
    it("#ensureInvoice should throw if the invoice doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        let uid = '';
        (0, utils_1.expect)((0, invoices_1.ensureInvoice)(uid)).to.be.eventually.rejected;
    }));
    it("should ensure an invoice exists and not throw", () => __awaiter(void 0, void 0, void 0, function* () {
        let account = yield utils.createAccount();
        var webhook_url = "https://anypay.sv/api/test/webhooks";
        let invoice = yield (0, invoices_1.createInvoice)({
            account,
            amount: 10,
            webhook_url
        });
        console.log(invoice, 'createInvoice.result');
        invoice = yield (0, invoices_1.ensureInvoice)(invoice.uid);
        (0, utils_1.expect)(invoice.webhook_url).to.be.equal(webhook_url);
    }));
    it('should create payment options for the invoice', () => __awaiter(void 0, void 0, void 0, function* () {
        let [account] = yield utils.createAccountWithAddress();
        let invoice = yield (0, invoices_1.createInvoice)({
            account,
            amount: 10
        });
        let options = yield (0, invoices_1.getPaymentOptions)(invoice.uid);
        (0, utils_1.expect)(options.length).to.be.equal(1);
        (0, utils_1.expect)(options[0].get('currency')).to.be.equal("BSV");
    }));
    it('should include a default webhook url', () => __awaiter(void 0, void 0, void 0, function* () {
        let [account] = yield utils.createAccountWithAddress();
        let invoice = yield (0, invoices_1.createInvoice)({
            account,
            amount: 10
        });
        (0, utils_1.expect)(invoice.webhook_url).to.be.equal('https://api.anypayx.com/v1/api/test/webhooks');
    }));
});
//# sourceMappingURL=invoices_test.js.map