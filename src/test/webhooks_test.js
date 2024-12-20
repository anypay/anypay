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
const http = __importStar(require("superagent"));
const invoices_1 = require("@/lib/invoices");
const webhooks_1 = require("@/lib/webhooks");
const prisma_1 = __importDefault(require("@/lib/prisma"));
describe('Getting Prices', () => {
    beforeEach(() => utils_1.spy.restore());
    it('should require that a webhook URL is a valid URL', () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "notavalidurl";
        (0, utils_1.expect)((0, invoices_1.createInvoice)({
            account: utils_1.account,
            amount: 10,
            webhook_url
        })).to.be.eventually.rejectedWith(new invoices_1.InvalidWebhookURL(webhook_url));
    }));
    it('should accept a valid webhook URL', () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "https://anypay.sv/api/test/webhooks";
        let invoice = yield (0, invoices_1.createInvoice)({
            account: utils_1.account,
            amount: 10,
            webhook_url
        });
        (0, utils_1.expect)(invoice.webhook_url).to.be.equal(webhook_url);
        let webhook = yield (0, webhooks_1.findWebhook)({ invoice_uid: invoice.uid });
        (0, utils_1.expect)(webhook.url).to.be.equal(webhook_url);
    }));
    it('should attempt a webhook', () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "https://reqbin.com/echo/post/json";
        let invoice = yield (0, invoices_1.createInvoice)({
            account: utils_1.account,
            amount: 10,
            webhook_url
        });
        let webhook = yield (0, webhooks_1.findWebhook)({ invoice_uid: invoice.uid });
        utils_1.spy.on(http, ['get', 'post']);
        utils_1.spy.on(webhook, ['invoiceToJSON']);
        yield (0, webhooks_1.attemptWebhook)(webhook);
        (0, utils_1.expect)(http.post).to.have.been.called();
        (0, utils_1.expect)(webhook.status).to.be.equal('success');
    }));
    it('should fair a webhook when server not responding', () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "https://anypay.sv/api/invalid";
        let invoice = yield (0, invoices_1.createInvoice)({
            account: utils_1.account,
            amount: 10,
            webhook_url
        });
        let webhook = yield (0, webhooks_1.findWebhook)({ invoice_uid: invoice.uid });
        utils_1.spy.on(http, ['get', 'post']);
        yield (0, webhooks_1.attemptWebhook)(webhook);
        (0, utils_1.expect)(http.post).to.have.been.called();
        (0, utils_1.expect)(webhook.status).to.be.equal('failed');
    }));
    it('should preventing a webhook attempt given prior success', () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "https://reqbin.com/echo/post/json";
        let invoice = yield (0, invoices_1.createInvoice)({
            account: utils_1.account,
            amount: 10,
            webhook_url
        });
        let webhook = yield (0, webhooks_1.findWebhook)({ invoice_uid: invoice.uid });
        yield (0, webhooks_1.attemptWebhook)(webhook);
        (0, utils_1.expect)(webhook.status).to.be.equal('success');
        (0, utils_1.expect)((0, webhooks_1.attemptWebhook)(webhook)).to.be.eventually.rejectedWith(webhooks_1.WebhookAlreadySent);
    }));
    it('webhook retry schedule should default to no_retry', () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "https://reqbin.com/echo/post/json";
        let invoice = yield (0, invoices_1.createInvoice)({
            account: utils_1.account,
            amount: 10,
            webhook_url
        });
        let webhook = yield (0, webhooks_1.findWebhook)({ invoice_uid: invoice.uid });
        (0, utils_1.expect)(webhook.retry_policy).to.be.equal('no_retry');
    }));
    it('should allow webhook_url to be set on account', () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "https://reqbin.com/echo/post/json";
        let account = yield utils.createAccount();
        yield prisma_1.default.accounts.update({
            where: {
                id: account.id
            },
            data: {
                webhook_url
            }
        });
        let invoice = yield (0, invoices_1.createInvoice)({
            account,
            amount: 10
            // no webhook_url specified here, default to account webhook_url
        });
        let webhook = yield (0, webhooks_1.findWebhook)({ invoice_uid: invoice.uid });
        (0, utils_1.expect)(webhook.url).to.be.equal(webhook_url);
    }));
    it('should attempt a webhook', () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "https://reqbin.com/echo/post/json";
        let invoice = yield (0, invoices_1.createInvoice)({
            account: utils_1.account,
            amount: 10,
            webhook_url
        });
        let webhook = yield (0, webhooks_1.findWebhook)({ invoice_uid: invoice.uid });
        utils_1.spy.on(http, ['get', 'post']);
        utils_1.spy.on(webhook, ['invoiceToJSON']);
        yield (0, webhooks_1.attemptWebhook)(webhook);
        (0, utils_1.expect)(http.post).to.have.been.called();
        (0, utils_1.expect)(webhook.status).to.be.equal('success');
    }));
    it('should fair a webhook when server not responding', () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "https://anypay.sv/api/invalid";
        let invoice = yield (0, invoices_1.createInvoice)({
            account: utils_1.account,
            amount: 10,
            webhook_url
        });
        let webhook = yield (0, webhooks_1.findWebhook)({ invoice_uid: invoice.uid });
        utils_1.spy.on(http, ['get', 'post']);
        yield (0, webhooks_1.attemptWebhook)(webhook);
        (0, utils_1.expect)(http.post).to.have.been.called();
        (0, utils_1.expect)(webhook.status).to.be.equal('failed');
    }));
    it('should preventing a webhook attempt given prior success', () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "https://reqbin.com/echo/post/json";
        let invoice = yield (0, invoices_1.createInvoice)({
            account: utils_1.account,
            amount: 10,
            webhook_url
        });
        let webhook = yield (0, webhooks_1.findWebhook)({ invoice_uid: invoice.uid });
        yield (0, webhooks_1.attemptWebhook)(webhook);
        (0, utils_1.expect)(webhook.status).to.be.equal('success');
        (0, utils_1.expect)((0, webhooks_1.attemptWebhook)(webhook)).to.be.eventually.rejectedWith(webhooks_1.WebhookAlreadySent);
    }));
    it('webhook retry schedule should default to no_retry', () => __awaiter(void 0, void 0, void 0, function* () {
        var webhook_url = "https://reqbin.com/echo/post/json";
        yield (0, invoices_1.createInvoice)({
            account: utils_1.account,
            amount: 10,
            webhook_url
        });
    }));
});
//# sourceMappingURL=webhooks_test.js.map