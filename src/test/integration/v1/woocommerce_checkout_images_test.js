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
describe("Setting Your Woocommerce Image", () => __awaiter(void 0, void 0, void 0, function* () {
    it('should allow setting your image', () => __awaiter(void 0, void 0, void 0, function* () {
        var response = yield utils_1.server.inject({
            method: 'GET',
            url: '/v1/woocommerce/checkout_image',
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            }
        });
        var result = response.result;
        (0, utils_1.expect)(result.image.name).to.be.equal('ANYPAY');
        response = yield utils_1.server.inject({
            method: 'PUT',
            url: `/v1/woocommerce/checkout_image`,
            payload: {
                name: "BTC"
            },
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            }
        });
        response = yield utils_1.server.inject({
            method: 'GET',
            url: '/v1/woocommerce/checkout_image',
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            }
        });
        result = response.result;
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
        //expect(result.image.name).to.be.equal('BTC');
        (0, utils_1.expect)(result.image.url).to.be.a('string');
    }));
    it("GET /v1/woocommerce/checkout_images should list all available images", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: '/v1/woocommerce/checkout_images',
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            }
        });
        (0, utils_1.expect)(response.result.images).to.be.an('object');
    }));
    it("GET /v1/woocommerce/accounts/{account_id}/checkout_image.pngshould return chosen image for account", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield utils_1.server.inject({
            method: 'GET',
            url: `/v1/woocommerce/accounts/${utils_1.account.id}/checkout_image.png`,
            headers: {
                Authorization: `Bearer ${utils_1.jwt}`
            }
        });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
    }));
}));
//# sourceMappingURL=woocommerce_checkout_images_test.js.map