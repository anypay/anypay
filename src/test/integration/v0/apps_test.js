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
describe("API V0", () => __awaiter(void 0, void 0, void 0, function* () {
    it("GET /apps should return a list of your apps", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, utils_1.v0AuthRequest)(utils_1.account, {
            method: 'GET',
            url: '/apps'
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
    }));
    it("POST /apps should create a new app", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, utils_1.v0AuthRequest)(utils_1.account, {
            method: 'POST',
            url: '/apps',
            payload: {
                name: utils_1.chance.word()
            }
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
    }));
    it("GET /apps/{id} should return details of a single app", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, utils_1.v0AuthRequest)(utils_1.account, {
            method: 'POST',
            url: '/apps',
            payload: {
                name: utils_1.chance.word()
            }
        });
        const result = response.result;
        let { statusCode } = yield (0, utils_1.v0AuthRequest)(utils_1.account, {
            method: 'GET',
            url: `/apps/${result.app.id}`
        });
        (0, utils_1.expect)(statusCode).to.be.equal(200);
    }));
    it("GET /apps/{id} should return empty with invalid app id", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, utils_1.v0AuthRequest)(utils_1.account, {
            method: 'GET',
            url: '/apps/777777'
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(404);
    }));
}));
//# sourceMappingURL=apps_test.js.map