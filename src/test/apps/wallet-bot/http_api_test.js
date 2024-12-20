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
const plugin_1 = require("@/apps/wallet-bot/plugin");
const wallet_bot_1 = require("@/apps/wallet-bot");
const invoices_1 = require("@/lib/invoices");
describe('Wallet Bot API', () => {
    var walletBotServer;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        walletBotServer = yield (0, plugin_1.createServer)();
    }));
    describe('Creating invoices for the wallet bot to pay', () => {
        it('POST /v1/api/apps/wallet-bot/invoices should create an invoice', () => __awaiter(void 0, void 0, void 0, function* () {
            const { walletBot } = yield (0, wallet_bot_1.findOrCreateWalletBot)(utils_1.account);
            const accessToken = yield (0, wallet_bot_1.getAccessToken)(walletBot);
            const token = yield accessToken.uid;
            const response = yield walletBotServer.inject({
                url: '/v1/api/apps/wallet-bot/invoices',
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
                },
                payload: {
                    currency: 'BSV',
                    to: {
                        currency: 'USD',
                        amount: 5.20,
                        address: '1ErZaNaYtbUSfyXK8yc9dvH2ofMpw8r7DT'
                    },
                    options: {
                        webhook_url: 'https://webhooks.anypayx.com/wallet-bot'
                    }
                }
            });
            (0, utils_1.expect)(response.statusCode).to.be.equal(201);
            const invoice = yield (0, invoices_1.ensureInvoice)(response.result.invoice_uid);
            (0, utils_1.expect)(invoice.status).to.be.equal('unpaid');
            (0, utils_1.expect)(invoice.currency).to.be.equal('BSV');
        }));
        it('POST /v1/api/apps/wallet-bot/invoices should return only a single payment option', () => __awaiter(void 0, void 0, void 0, function* () {
            const { walletBot } = yield (0, wallet_bot_1.findOrCreateWalletBot)(utils_1.account);
            const accessToken = yield (0, wallet_bot_1.getAccessToken)(walletBot);
            const token = yield accessToken.uid;
            const response = yield walletBotServer.inject({
                url: '/v1/api/apps/wallet-bot/invoices',
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
                },
                payload: {
                    currency: 'BSV',
                    to: {
                        currency: 'USD',
                        amount: 5.20,
                        address: '1ErZaNaYtbUSfyXK8yc9dvH2ofMpw8r7DT'
                    },
                    options: {
                        webhook_url: 'https://webhooks.anypayx.com/wallet-bot'
                    }
                }
            });
            const json = response.result;
            let optionsResponse = yield utils_1.server.inject({
                method: 'GET',
                url: `/r/${json.invoice_uid}`,
                headers: {
                    'Accept': 'application/payment-options',
                    'x-paypro-version': 2
                }
            });
            (0, utils_1.expect)(optionsResponse.result.paymentOptions.length).to.be.equal(1);
            (0, utils_1.expect)(optionsResponse.result.paymentOptions[0].currency).to.be.equal('BSV');
            (0, utils_1.expect)(optionsResponse.result.paymentOptions[0].chain).to.be.equal('BSV');
            (0, utils_1.expect)(response.statusCode).to.be.equal(201);
        }));
        it('GET /v1/api/apps/wallet-bot/unpaid?currency=DASH should list unpaid invoices by currency', () => __awaiter(void 0, void 0, void 0, function* () {
            const account = yield (0, utils_1.generateAccount)();
            const { walletBot } = yield (0, wallet_bot_1.findOrCreateWalletBot)(account);
            const accessToken = yield (0, wallet_bot_1.getAccessToken)(walletBot);
            const token = yield accessToken.uid;
            yield walletBotServer.inject({
                url: '/v1/api/apps/wallet-bot/invoices',
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
                },
                payload: {
                    currency: 'BSV',
                    to: {
                        currency: 'USD',
                        amount: 5.20,
                        address: '1ErZaNaYtbUSfyXK8yc9dvH2ofMpw8r7DT'
                    },
                    options: {
                        webhook_url: 'https://webhooks.anypayx.com/wallet-bot'
                    }
                }
            });
            const dashResponse = yield walletBotServer.inject({
                url: `/v0/api/apps/wallet-bot/invoices?status=unpaid&currency=DASH`,
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
                },
            });
            (0, utils_1.expect)(dashResponse.result.invoices).to.be.an('array');
            (0, utils_1.expect)(dashResponse.result.invoices.length).to.be.equal(0);
            const bsvResponse = yield walletBotServer.inject({
                url: `/v0/api/apps/wallet-bot/invoices?status=unpaid&currency=BSV`,
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
                },
            });
            (0, utils_1.expect)(bsvResponse.result.invoices).to.be.an('array');
            (0, utils_1.expect)(bsvResponse.result.invoices.length).to.be.equal(1);
        }));
    });
    describe("Cancelling Invoices", () => {
        it.skip('DELETE /v1/api/apps/wallet-bot/invoices/{uid} should cancel invoice', () => __awaiter(void 0, void 0, void 0, function* () {
            const { walletBot } = yield (0, wallet_bot_1.findOrCreateWalletBot)(utils_1.account);
            const accessToken = yield (0, wallet_bot_1.getAccessToken)(walletBot);
            const token = yield accessToken.uid;
            const response = yield walletBotServer.inject({
                url: '/v1/api/apps/wallet-bot/invoices',
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
                },
                payload: {
                    currency: 'BSV',
                    to: {
                        currency: 'USD',
                        amount: 5.20,
                        address: '1ErZaNaYtbUSfyXK8yc9dvH2ofMpw8r7DT'
                    },
                    options: {
                        webhook_url: 'https://webhooks.anypayx.com/wallet-bot'
                    }
                }
            });
            const unpaid = yield (0, invoices_1.ensureInvoice)(response.result.invoice_uid);
            (0, utils_1.expect)(unpaid.status).to.be.equal('unpaid');
            const { invoice_uid } = response.result;
            const cancelResponse = yield walletBotServer.inject({
                url: `/v1/api/apps/wallet-bot/invoices/${invoice_uid}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
                }
            });
            const cancelled = yield (0, invoices_1.ensureInvoice)(cancelResponse.result.invoice_uid);
            (0, utils_1.expect)(cancelled.status).to.be.equal('cancelled');
        }));
    });
});
//# sourceMappingURL=http_api_test.js.map