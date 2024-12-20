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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const invoices_1 = require("@/lib/invoices");
const coins_1 = require("@/lib/coins");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const utils_1 = require("@test/utils");
const options = [{
        currency: 'USDC',
        chain: 'MATIC'
    }, {
        currency: 'USDC',
        chain: 'ETH'
    }, {
        currency: 'USDC',
        chain: 'AVAX'
    }, {
        currency: 'USDT',
        chain: 'MATIC'
    }, {
        currency: 'USDT',
        chain: 'ETH'
    }, {
        currency: 'USDT',
        chain: 'AVAX'
    }, {
        currency: 'BTC',
        chain: 'BTC'
    }, {
        currency: 'BCH',
        chain: 'BCH'
    }, {
        currency: 'BSV',
        chain: 'BSV'
    }, {
        currency: 'LTC',
        chain: 'LTC'
    }, {
        currency: 'DASH',
        chain: 'DASH'
    }, {
        currency: 'DOGE',
        chain: 'DOGE'
    }, {
        currency: 'XMR',
        chain: 'XMR'
    }];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, coins_1.refreshCoins)();
        const account = yield (0, utils_1.generateAccount)();
        let invoice = yield (0, invoices_1.createInvoice)({
            account,
            amount: 100
        });
        const records = yield prisma_1.default.payment_options.findMany({
            where: {
                invoice_uid: invoice.uid
            }
        });
        for (let option of records) {
            const { chain, currency } = option;
            const paymentOption = yield prisma_1.default.payment_options.findFirstOrThrow({
                where: {
                    chain,
                    currency,
                    invoice_uid: invoice.uid
                }
            });
            if (!paymentOption) {
                console.log('payment option not found', { chain, currency });
            }
        }
        for (let option of options) {
            try {
                const { chain, currency } = option;
                yield prisma_1.default.payment_options.findFirstOrThrow({
                    where: {
                        chain,
                        currency,
                        invoice_uid: invoice.uid
                    }
                });
            }
            catch (error) {
                console.error(error);
            }
        }
    });
}
main();
//# sourceMappingURL=payment_options.js.map