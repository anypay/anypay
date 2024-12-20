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
const utils_1 = require("@test/utils");
const utils = __importStar(require("@test/utils"));
describe("Setting Addresses Via REST", () => __awaiter(void 0, void 0, void 0, function* () {
    var account;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        account = yield utils.generateAccount();
    }));
    it("PUT /addresses/DASH should set the DASH address", () => __awaiter(void 0, void 0, void 0, function* () {
        var address = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';
        const account = yield utils.generateAccount();
        const authHeader = yield (0, utils_1.createAuthHeader)(account);
        console.log({ authHeader });
        const response = yield utils_1.server.inject({
            method: 'put',
            url: '/addresses/DASH',
            payload: {
                address: address
            },
            headers: {
                Authorization: `Basic ${authHeader}`
            }
        });
        console.log('--DASH--', response.result);
        (0, utils_1.expect)(response.result.value).to.be.equal(address);
    }));
    it("PUT /addresses/BTC should set the BTC address", () => __awaiter(void 0, void 0, void 0, function* () {
        var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';
        let response = yield (0, utils_1.v0AuthRequest)(account, {
            method: 'PUT',
            url: '/addresses/BTC',
            payload: {
                address
            }
        });
        const result = response.result;
        (0, utils_1.expect)(result.value).to.be.equal(address);
    }));
    it("GET /addresses should return a list of account addresses", () => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield utils.generateAccount();
        var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';
        yield (0, utils_1.v0AuthRequest)(account, {
            method: 'PUT',
            url: '/addresses/BTC',
            payload: {
                address
            }
        });
        var response = yield (0, utils_1.v0AuthRequest)(account, {
            method: 'GET',
            url: '/addresses',
            payload: {
                address
            }
        });
        const result = response.result;
        (0, utils_1.expect)(result['BTC']).to.be.equal(address);
    }));
}));
//# sourceMappingURL=addresses_test.js.map