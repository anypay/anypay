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
const webhooks_1 = require("@/lib/webhooks");
describe("Listing Available Webhooks", () => __awaiter(void 0, void 0, void 0, function* () {
    it("GET /v1/api/webhooks get your account's webhooks", () => __awaiter(void 0, void 0, void 0, function* () {
        let account = yield utils.createAccount();
        let response = yield utils.authRequest(account, {
            method: 'GET',
            url: '/v1/api/webhooks'
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
        (0, utils_1.expect)(response.result.webhooks.length).to.be.equal(0);
    }));
    it.skip("POST /v1/api/webhooks/:invoice_uid/attempts should allow retrying failed webhook", () => __awaiter(void 0, void 0, void 0, function* () {
        let account = yield utils.createAccount();
        let invoice = yield (0, invoices_1.createInvoice)({
            account,
            amount: 10,
            webhook_url: 'https://anypayx.com/api/invalid'
        });
        let response = yield utils.authRequest(account, {
            method: 'POST',
            url: `/v1/api/webhooks/${invoice.uid}/attempts`
        });
        const result = response.result;
        (0, utils_1.expect)(response.statusCode).to.be.equal(201);
        (0, utils_1.expect)(result.webhook.invoice_uid).to.be.equal(invoice.uid);
        (0, utils_1.expect)(result.webhook.attempts.length).to.be.equal(1);
        (0, utils_1.expect)(result.attempt.response_code).to.be.equal(405);
        response = yield utils.authRequest(account, {
            method: 'GET',
            url: '/v1/api/webhooks'
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
        (0, utils_1.expect)(response.result.webhooks.length).to.be.equal(1);
    }));
    it("should return a list that is not empty", () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "https://reqbin.com/echo/post/json";
        let account = yield utils.createAccount();
        var response = yield utils.authRequest(account, {
            method: 'GET',
            url: '/v1/api/webhooks'
        });
        (0, utils_1.expect)(response.result.webhooks.length).to.be.equal(0);
        yield (0, invoices_1.createInvoice)({
            account,
            amount: 10,
            webhook_url
        });
        response = yield utils.authRequest(account, {
            method: 'GET',
            url: '/v1/api/webhooks'
        });
        const result = response.result;
        (0, utils_1.expect)(result.webhooks.length).to.be.equal(1);
        (0, utils_1.expect)(result.webhooks[0].url).to.be.equal(webhook_url);
        (0, utils_1.expect)(result.webhooks[0].status).to.be.equal('pending');
        yield (0, invoices_1.createInvoice)({
            account,
            amount: 10,
            webhook_url
        });
        response = yield utils.authRequest(account, {
            method: 'GET',
            url: '/v1/api/webhooks'
        });
        (0, utils_1.expect)(response.result.webhooks.length).to.be.equal(2);
    }));
    it.skip('should also include the list of attempts', () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "https://reqbin.com/echo/post/json";
        let account = yield utils.createAccount();
        let invoice = yield (0, invoices_1.createInvoice)({
            account,
            amount: 10,
            webhook_url
        });
        var response = yield utils.authRequest(account, {
            method: 'GET',
            url: '/v1/api/webhooks'
        });
        (0, utils_1.expect)(response.result.webhooks.length).to.be.equal(1);
        //expect((response.result as any).webhooks[0].attempts.length).to.be.equal(0)
        let webhook = yield (0, webhooks_1.findWebhook)({ invoice_uid: invoice.uid });
        yield (0, webhooks_1.attemptWebhook)(webhook);
        var response = yield utils.authRequest(account, {
            method: 'GET',
            url: '/v1/api/webhooks'
        });
        //expect((response.result as any).webhooks[0].attempts.length).to.be.equal(1)
        //expect(response.result.webhooks[0].status).to.be.equal('success')
        //expect(response.result.webhooks[0].attempts[0].response_code).to.be.equal(200)
    }));
}));
//# sourceMappingURL=webhooks_test.js.map