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
const lib_1 = require("@/lib");
const { ensureAccessToken } = lib_1.access;
describe("API V0 - CSV", () => __awaiter(void 0, void 0, void 0, function* () {
    it("GET /csv_reports.csv should return a CSV report", () => __awaiter(void 0, void 0, void 0, function* () {
        const { uid } = yield ensureAccessToken(utils_1.account);
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: `/csv_reports.csv?token=${uid}&start_date=${Date.now()}&end_date=${Date.now()}`
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
    }));
    it("GET /reports/csv/payments.csv should return a CSV report", () => __awaiter(void 0, void 0, void 0, function* () {
        const { uid } = yield ensureAccessToken(utils_1.account);
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: `/reports/csv/payments.csv?token=${uid}`
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
    }));
    it("GET /csv_reports.csv should reject unauthorized attempts with no token", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: `/csv_reports.csv`
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(400);
    }));
    it("GET /reports/csv/payments.csv should reject unauthorized attempts with no token", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: `/reports/csv/payments.csv`
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(400);
    }));
}));
//# sourceMappingURL=csv_reports_test.js.map