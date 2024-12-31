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
exports.accessToken = exports.jwt = exports.authHeaders = exports.auth = exports.createAuthHeader = exports.v0AuthRequest = exports.authRequest = exports.app = exports.walletBot = exports.account = exports.request = exports.server = exports.expect = exports.uuid = exports.assert = exports.chance = exports.spy = exports.chai = exports.generateKeypair = exports.newInvoice = exports.newAccountWithInvoice = exports.setAddresses = exports.createAccountWithAddresses = exports.payInvoice = exports.tx = exports.createAccountWithAddress = exports.createAccount = exports.generateAccount = exports.log = void 0;
require('dotenv').config();
const chance_1 = __importDefault(require("chance"));
const uuid = __importStar(require("uuid"));
exports.uuid = uuid;
const chance = new chance_1.default();
exports.chance = chance;
const assert_1 = __importDefault(require("assert"));
exports.assert = assert_1.default;
const accounts_1 = require("@/lib/accounts");
const access_tokens_1 = require("@/lib/access_tokens");
const addresses_1 = require("@/lib/addresses");
var log_1 = require("@/lib/log");
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return log_1.log; } });
const supertest_1 = __importDefault(require("supertest"));
const invoices_1 = require("@/lib/invoices");
const wallet_bot_1 = require("@/apps/wallet-bot");
//import { initFromConfig } from '../lib/coins'
const lib_1 = require("@/lib");
let account;
exports.account = account;
function generateAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, accounts_1.registerAccount)(chance.email(), chance.word());
    });
}
exports.generateAccount = generateAccount;
function createAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, accounts_1.registerAccount)(chance.email(), chance.word());
    });
}
exports.createAccount = createAccount;
function createAccountWithAddress() {
    return __awaiter(this, void 0, void 0, function* () {
        const account = yield (0, accounts_1.registerAccount)(chance.email(), chance.word());
        let keypair = yield generateKeypair();
        let address = yield (0, addresses_1.setAddress)(account, { currency: 'BSV', chain: 'BSV', value: keypair.address });
        return [account, address];
    });
}
exports.createAccountWithAddress = createAccountWithAddress;
exports.tx = {
    currency: 'BSV',
    chain: 'BSV',
    tx_hex: '010000000a39428dc1eef349536982d76d3e3d104b0ad6fed4fa0fe01a527cf0543b7d4eec000000006a473044022045f794d1d33907241eff32c3fc67de607103bcc84ad7975acbde216e0e38f5e802205529dbbfd28731615d5834ce858c59a90bfade3f15f223db095b60ab1eddbd8a41210365ed492b4ed7f035b4b864b04c544eec9d69bedba9c3d58dc32fd541fb510035ffffffffefb9e742019e1a909b4b8c98572f68df9ed4ab4d584591b886a4db603ef98aa6000000006b483045022100e605530ec2f4ce71546af0ed00cc5b28dee71c511be14583039b03878d4dbbc502206dab9ded2ab8c2f67a091a93d5b5540a7b180c704f0ee9fed99a5747f34271c2412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffffa36aabf3514238768a936d75184de65adae0ccbeedada5fd09fb1c727273c1b0000000006a473044022020304bf97e4f15926b2dc9285095ba45434ad74f82e7b0cf8463629620f0178c0220337c81793391622e920c3fa75e7626c414d045920ec71f8910e62243f4fa8880412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffff7524fc3006406e4b30abf55f775c2ff565163ee16f98aba8b64cbb0f774c879f000000006a47304402202acb74326262ab4d0b5253fc02b31ab436f73a4d3b818d52ae01dbd025fbcc57022033942db97e28838b9560c7ddde5c84cde2e297e5c370c84645366902cc8a1fc5412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffff24b0d52b06314b899eac83fc6c5f791354744b3cfc9ac86bd45b816e705ae784000000006b483045022100e93edb036392b9bed93f2bb2b99a331d1c326080f985b8764fdde0e09b33ab02022060dc8e711f1e7ea6c2232f59ddc69399560afdc279bf5792a3ff80efb1206f8c412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffff396ab152805481e38c37344dc3b51945b66cb09d166d40f9d165c873010bfa12000000006a4730440220527a6a2dcdb982fbfc98793a7ccee928e510c74224573daf915364c90b0df408022040ee018f4425e14feee2300806d79c8e4ef967eef8495350dcbda134da5ca2da412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffff87e98e98a4634bd98932391af9afad2a671e16796d194e064fb4a0e173f3b125000000006a4730440220263b63e3059785672c8551796a602227006bb67328554e8ae69807d8a5b0405702200be94a72aa46e8fa9ee44d125bc5f8b05b2775c2fa6f8fa0add473c85c2db51f412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffff47862c950357ffa82f19eea5f2f77a3ff6d64e68055298c6b35350881aa0e360000000006a4730440220466a3dac837cd3cb80b26420372a673b1ce6a8cff921c078d4d7b638e838aa3702202eefe32585e505a2ce38a05c230d1aa9d5b701d962e394ccaa6a0854e854c30f412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffff7db09172ebc4812857684f5d0b8fc244530c515b1fe00acf2f92195b3683a05e000000006b483045022100bb613a67445810eee4ebe134997e9678877f2e8e6f1290cb79cfa6232a4a6e8f0220076b2f2fb8c46e0ed9d5575bfa37ce646d0299670eba2a69017234baef758c60412103c848cbf6d9ed20f33b3f8ac28dcca39cb7ef1db3932a072f39bc6425cafa61a7ffffffffba4ebd3576e2a96d516c38d1452ed6155fcd1f44e0398ee9c66807980ac969fd000000006b48304502210092ee226ecd3a62c1f34b8318802f3c2706f35545a41461071240a13ff7753e8d02205bc713911ae0f00816ab201636c1d1a0fc39b426c0f9d02345920c1766a714b1412103d060ac612d77f1dde615d2d71cc0ad3ae9cc00e1d3dc15e492e578ff44d252f9ffffffff03f0537500000000001976a9143db59b7e157913df26c949269a6cfd16923a242888acb80b0000000000001976a914fde8f61612beecbf7532765d17ce9c36c860187888acd194d600000000001976a9143de59a7df3f1479e00d7b5cf4abcdfd0252d30e688ac00000000',
    tx_id: '6805c46f53b87cd350dc185ff2c4a48d2547bf86a76c25e9bb23a1b936092763'
};
function payInvoice(invoice) {
    return __awaiter(this, void 0, void 0, function* () {
        let payment = yield (0, payments_1.recordPayment)(invoice, {
            txid: exports.tx.tx_id,
            currency: exports.tx.currency,
            txhex: exports.tx.tx_hex
        });
        yield prisma_1.default.invoices.update({
            where: { id: invoice.id },
            data: {
                currency: 'BSV',
                currency: 'USD',
                status: 'paid',
                hash: (0, crypto_1.createHash)('sha256').update(uuid.v4()).digest().toString('hex')
            }
        });
        return payment;
    });
}
exports.payInvoice = payInvoice;
function createAccountWithAddresses() {
    return __awaiter(this, void 0, void 0, function* () {
        const account = yield (0, accounts_1.registerAccount)(chance.email(), chance.word());
        let { address } = yield generateKeypair();
        yield (0, addresses_1.setAddress)(account, { currency: 'BSV', chain: 'BSV', value: address });
        let { address: bch_address } = yield generateKeypair('BCH');
        yield (0, addresses_1.setAddress)(account, { currency: 'BCH', chain: 'BCH', value: bch_address });
        let { address: dash_address } = yield generateKeypair('DASH');
        yield (0, addresses_1.setAddress)(account, { currency: 'DASH', chain: 'DASH', value: dash_address });
        return account;
    });
}
exports.createAccountWithAddresses = createAccountWithAddresses;
function setAddresses(account) {
    return __awaiter(this, void 0, void 0, function* () {
        let { address } = yield generateKeypair();
        yield (0, addresses_1.setAddress)(account, { currency: 'BSV', chain: 'BSV', value: address });
        let { address: bch_address } = yield generateKeypair('BCH');
        yield (0, addresses_1.setAddress)(account, { currency: 'BCH', chain: 'BCH', value: bch_address });
        let { address: dash_address } = yield generateKeypair('DASH');
        yield (0, addresses_1.setAddress)(account, { currency: 'DASH', chain: 'DASH', value: dash_address });
        return account;
    });
}
exports.setAddresses = setAddresses;
function newAccountWithInvoice(params = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let account = yield createAccount();
        yield setAddresses(account);
        let invoice = yield (0, invoices_1.createInvoice)({
            account,
            amount: params.amount || 10
        });
        return [account, invoice];
    });
}
exports.newAccountWithInvoice = newAccountWithInvoice;
function newInvoice(params) {
    return __awaiter(this, void 0, void 0, function* () {
        let invoice = yield (0, invoices_1.createInvoice)({
            account: params.account,
            amount: params.amount || 52.00,
            webhook_url: 'https://anypayx.com/api/v1/test/webhooks'
        });
        return invoice;
    });
}
exports.newInvoice = newInvoice;
const scrypt_ts_1 = require("scrypt-ts");
function generateKeypair(currency = 'BSV') {
    return __awaiter(this, void 0, void 0, function* () {
        var bitcore = (0, bitcore_1.getBitcore)(currency);
        let privateKey = new bitcore.PrivateKey();
        let address = privateKey.toAddress();
        return {
            privateKey: privateKey.toWIF(),
            address: address.toString()
        };
    });
}
exports.generateKeypair = generateKeypair;
const chai_1 = __importDefault(require("chai"));
exports.chai = chai_1.default;
const chaiAsPromised = require('chai-as-promised');
chai_1.default.use(chaiAsPromised);
const spies = require('chai-spies');
chai_1.default.use(spies);
var spy = chai_1.default.spy.sandbox();
exports.spy = spy;
const expect = chai_1.default.expect;
exports.expect = expect;
var request, walletBot, app;
exports.request = request;
exports.walletBot = walletBot;
exports.app = app;
const server_1 = require("@/server/v0/server");
var server;
exports.server = server;
function authRequest(account, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const jwt = yield (0, jwt_1.generateAccountToken)({ account_id: account.id, uid: String(account.uid) });
        if (!params.headers) {
            params['headers'] = {};
        }
        //params.headers['Authorization'] = `Bearer ${accessToken.jwt}`
        params.headers['Authorization'] = `Bearer ${jwt}`;
        return server.inject(params);
    });
}
exports.authRequest = authRequest;
function v0AuthRequest(account, params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!params.headers) {
            params['headers'] = {};
        }
        params.headers['Authorization'] = `Basic ${yield createAuthHeader(account)}`;
        return server.inject(params);
    });
}
exports.v0AuthRequest = v0AuthRequest;
function createAuthHeader(account) {
    return __awaiter(this, void 0, void 0, function* () {
        let accessToken = yield (0, access_tokens_1.ensureAccessToken)(account);
        return new Buffer(accessToken.uid + ':').toString('base64');
    });
}
exports.createAuthHeader = createAuthHeader;
function auth(account, version = 1) {
    var strategy = authRequest;
    if (version === 0) {
        strategy = v0AuthRequest;
    }
    return function (req) {
        return __awaiter(this, void 0, void 0, function* () {
            return strategy(account, req);
        });
    };
}
exports.auth = auth;
function authHeaders(username, password, headers = {}) {
    let token = new Buffer(`${username}:${password}`).toString('base64');
    headers['Authorization'] = `Basic ${token}`;
    return headers;
}
exports.authHeaders = authHeaders;
const bitcore_1 = require("@/lib/bitcore");
const payments_1 = require("@/lib/payments");
const crypto_1 = require("crypto");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const jwt_1 = require("@/lib/jwt");
const WIF = lib_1.config.get('ANYPAY_SIMPLE_WALLET_WIF') || new scrypt_ts_1.bsv.PrivateKey().toWIF();
if (!WIF) {
    throw new Error('ANYPAY_SIMPLE_WALLET_WIF environment variable must be set before running tests.');
}
//const wallet = Wallet.fromWIF(WIF)
//export { wallet } 
beforeEach(() => {
    spy.restore();
});
var jwt, accessToken;
exports.jwt = jwt;
exports.accessToken = accessToken;
before(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, lib_1.initialize)();
    exports.server = server = yield (0, server_1.NewServer)();
    exports.request = request = (0, supertest_1.default)(server.listener);
    exports.account = account = yield createAccountWithAddresses();
    exports.accessToken = accessToken = yield (0, access_tokens_1.ensureAccessToken)(account);
    exports.jwt = jwt = yield (0, jwt_1.generateAccountToken)({ account_id: account.id, uid: String(account.uid) });
    exports.walletBot = walletBot = (yield (0, wallet_bot_1.findOrCreateWalletBot)(account)).walletBot;
}));
//# sourceMappingURL=utils.js.map