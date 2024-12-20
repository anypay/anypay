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
const log_1 = require("@/lib/log");
const config_1 = require("@/lib/config");
describe("Webhooks Default Endpoint", () => __awaiter(void 0, void 0, void 0, function* () {
    it('should log the webhook data', () => __awaiter(void 0, void 0, void 0, function* () {
        utils_1.spy.on(log_1.log, ['info']);
        let [account, invoice] = yield (0, utils_1.newAccountWithInvoice)();
        log_1.log.info('test.account.created', account);
        const rocketchat_webhook_url = config_1.config.get('ROCKETCHAT_WEBHOOK_URL');
        config_1.config.set('ROCKETCHAT_WEBHOOK_URL', config_1.config.get('DEFAULT_WEBHOOK_URL'));
        var response = yield utils_1.server.inject({
            method: 'POST',
            url: `/v1/api/test/webhooks`,
            payload: invoice
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
        (0, utils_1.expect)(log_1.log.info).to.have.been.called.with('webhooks.test.received');
        config_1.config.set('ROCKETCHAT_WEBHOOK_URL', rocketchat_webhook_url);
    }));
    it('should attempt a webhook for an invoice', () => __awaiter(void 0, void 0, void 0, function* () {
        let [account, invoice] = yield (0, utils_1.newAccountWithInvoice)();
        log_1.log.info('test.account.created', account);
        var response = yield utils_1.server.inject({
            method: 'POST',
            url: `/v1/api/webhooks/${invoice.uid}/attempts`,
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            }
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(201);
    }));
    it('should list webhoks', () => __awaiter(void 0, void 0, void 0, function* () {
        let [account] = yield (0, utils_1.newAccountWithInvoice)();
        log_1.log.info('test.account.created', account);
        var response = yield utils_1.server.inject({
            method: 'GET',
            url: `/v1/api/webhooks`,
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            }
        });
        const result = response.result;
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
        (0, utils_1.expect)(result.webhooks).to.be.an('array');
    }));
}));
//# sourceMappingURL=webhooks_test.js.map