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
const blockcypher_1 = require("@/lib/blockcypher");
const utils_1 = require("@test/utils");
const fixtures = __importStar(require("@test/fixtures"));
const payments_1 = require("@/lib/payments");
const core_1 = require("@/lib/core");
const prisma_1 = __importDefault(require("@/lib/prisma"));
describe("Confirming Transactions", () => {
    it.skip('should change from unpaid to confirming when BTC payment received', () => __awaiter(void 0, void 0, void 0, function* () {
    }));
    it.skip('should change from confirming to confirmed when blockcypher webhook received', () => __awaiter(void 0, void 0, void 0, function* () {
        // try again with new blockcypher token or another strategy. This is failing with 429 on the token
        const account = yield (0, utils_1.generateAccount)();
        yield (0, core_1.setAddress)({
            account_id: account.id,
            currency: 'BTC',
            chain: 'BTC',
            address: fixtures.BTC_Confirmation_Test.address
        });
        let invoice = yield (0, utils_1.newInvoice)({ account, amount: 100 });
        (0, utils_1.expect)(invoice.status).to.be.equal('unpaid');
        let payment = yield (0, payments_1.recordPayment)(invoice, {
            txid: fixtures.BTC_Confirmation_Test.txid,
            currency: 'BTC',
            txhex: fixtures.BTC_Confirmation_Test.txid
        });
        (0, utils_1.expect)(payment.status).to.be.equal('confirming');
        yield prisma_1.default.invoices.update({
            where: {
                id: invoice.id
            },
            data: {
                status: 'confirming',
                hash: fixtures.BTC_Confirmation_Test.txid
            }
        });
        yield (0, blockcypher_1.confirmTransactionsFromBlockWebhook)(fixtures.BTC_Confirmation_Test.blockcpher_webhook_payload);
        payment = yield prisma_1.default.payments.findFirstOrThrow({
            where: {
                invoice_uid: invoice.uid
            }
        });
        invoice = yield prisma_1.default.invoices.findFirstOrThrow({
            where: {
                uid: invoice.uid
            }
        });
        (0, utils_1.expect)(payment.status).to.be.equal('confirmed');
        (0, utils_1.expect)(invoice.status).to.be.equal('paid');
    }));
});
//# sourceMappingURL=confirmations_test.js.map