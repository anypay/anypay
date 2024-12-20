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
const config_1 = require("@/lib/config");
const required_fee_rate_1 = require("@/lib/pay/required_fee_rate");
const utils_1 = require("@test/utils");
describe("Required Fee Rate", () => {
    it("should get the required fee rate from environment variables", () => __awaiter(void 0, void 0, void 0, function* () {
        const environmentVariable = Number(config_1.config.get('REQUIRED_FEE_RATE_DOGE'));
        (0, utils_1.expect)(environmentVariable).to.be.greaterThanOrEqual(1);
        const requiredFeeRate = yield (0, required_fee_rate_1.getRequiredFeeRate)({ chain: 'DOGE' });
        (0, utils_1.expect)(requiredFeeRate).to.be.equal(environmentVariable);
    }));
    it("should default to value of 1 satoshi per byte if no variable set", () => __awaiter(void 0, void 0, void 0, function* () {
        const environmentVariable = process.env['REQUIRED_FEE_RATE_BSV'];
        (0, utils_1.expect)(environmentVariable).to.be.equal(undefined);
        const requiredFeeRate = yield (0, required_fee_rate_1.getRequiredFeeRate)({ chain: 'BSV' });
        (0, utils_1.expect)(requiredFeeRate).to.be.equal(1);
    }));
    it.skip("should allow the plugin to determine the required fee rate for a coin", () => {
        //TODO: Load a plugin dynamically into the Anypay Engine with custom getRequiredFeeRate()
        /*
         * import {find} from '../../plugins'
         * const plugin = plugins.find({
         *   chain: 'BTC',
         *   currency: 'BTC'
         * })
         *
         * let requiredFeeRate = await plugin.getRequiredFeeRate()
         *
         * expect(requiredFeeRate).to.be.greaterThan(0)
         *
         */
    });
});
//# sourceMappingURL=required_fee_rate_test.js.map