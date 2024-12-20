"use strict";
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
require('dotenv').config();
const lib_1 = require("@/lib");
const utils_1 = require("@test/utils");
describe("Settings", () => {
    describe("account settings", () => {
        it("setDenomination should set the denomination", () => __awaiter(void 0, void 0, void 0, function* () {
            const account = yield (0, utils_1.generateAccount)();
            let denomination = yield lib_1.settings.setDenomination(account.id, "BTC");
            denomination = yield lib_1.settings.setDenomination(account.id, "VEF");
            utils_1.assert.strictEqual(denomination, "VEF");
        }));
        it("getDenomination should return the denomination", () => __awaiter(void 0, void 0, void 0, function* () {
            const account = yield (0, utils_1.generateAccount)();
            yield lib_1.settings.setDenomination(account.id, "GBP");
            let denomination = yield lib_1.settings.getDenomination(account.id);
            utils_1.assert.strictEqual(denomination, "GBP");
        }));
    });
});
//# sourceMappingURL=settings_test.js.map