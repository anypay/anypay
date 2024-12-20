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
const invoices_1 = require("@/lib/invoices");
const utils_1 = require("@test/utils");
describe("Invoice Events", () => __awaiter(void 0, void 0, void 0, function* () {
    it("GET /v1/api/invoices/{invoice_uid}/events should list events for invoice", () => __awaiter(void 0, void 0, void 0, function* () {
        const invoice = yield (0, invoices_1.createInvoice)({
            amount: 100,
            account: utils_1.account
        });
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: `/v1/api/invoices/${invoice.uid}/events`,
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            },
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
        (0, utils_1.expect)(response.result.events).to.be.an('array');
    }));
    it("should reject when requesting events for unauthorized invoice", () => __awaiter(void 0, void 0, void 0, function* () {
        const [another, invoice] = yield (0, utils_1.newAccountWithInvoice)();
        utils_1.log.debug('test.account.another.created', another);
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: `/v1/api/invoices/${invoice.uid}/events`,
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            },
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(401);
    }));
}));
//# sourceMappingURL=invoice_events_test.js.map