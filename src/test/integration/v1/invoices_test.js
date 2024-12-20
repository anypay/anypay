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
const jwt_1 = require("@/lib/jwt");
const passwords = __importStar(require("@/lib/password"));
describe("Listing Available Webhooks", () => __awaiter(void 0, void 0, void 0, function* () {
    it("POST /v1/api/account/register should register an account", () => __awaiter(void 0, void 0, void 0, function* () {
        let email = utils_1.chance.email();
        let password = utils_1.chance.word();
        let response = yield utils_1.request
            .post('/v1/api/account/register')
            .send({ email, password });
        (0, utils_1.expect)(response.statusCode).to.be.equal(201);
        (0, utils_1.expect)(response.body.user.id).to.be.greaterThan(0);
        (0, utils_1.expect)(response.body.accessToken).to.be.a("string");
        const decodedToken = yield (0, jwt_1.verifyToken)(response.body.accessToken);
        (0, utils_1.expect)(decodedToken.account_id).to.be.equal(response.body.user.id);
    }));
    it("POST /v1/api/account/login should return an accessToken and user", () => __awaiter(void 0, void 0, void 0, function* () {
        let email = utils_1.chance.email();
        let password = utils_1.chance.word();
        let { body } = yield utils_1.request
            .post('/v1/api/account/register')
            .send({ email, password });
        let response = yield utils_1.request
            .post('/v1/api/account/login')
            .send({ email, password });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
        (0, utils_1.expect)(response.body.user.id).to.be.greaterThan(0);
        let { accessToken } = response.body;
        (0, utils_1.expect)(accessToken).to.be.a("string");
        const decodedToken = yield (0, jwt_1.verifyToken)(accessToken);
        (0, utils_1.expect)(decodedToken.account_id).to.be.equal(body.user.id);
    }));
    it("POST /v1/api/account/login with invalid creds should return a 401", () => __awaiter(void 0, void 0, void 0, function* () {
        let email = utils_1.chance.email();
        let password = utils_1.chance.word();
        yield utils_1.request
            .post('/v1/api/account/register')
            .send({ email, password });
        let response = yield utils_1.request
            .post('/v1/api/account/login')
            .send({ email, password: 'inv@lid' });
        (0, utils_1.expect)(response.statusCode).to.be.equal(401);
        (0, utils_1.expect)(response.body.error).to.be.a('string');
    }));
    it("GET /v1/api/account/my-account should require an access token", () => __awaiter(void 0, void 0, void 0, function* () {
        let email = utils_1.chance.email();
        let password = utils_1.chance.word();
        var response = yield utils_1.request
            .post('/v1/api/account/register')
            .send({ email, password });
        const { accessToken } = response.body;
        response = yield utils_1.request
            .get('/v1/api/account/my-account');
        (0, utils_1.expect)(response.statusCode).to.be.equal(401);
        response = yield utils_1.request
            .get('/v1/api/account/my-account')
            .set('Authorization', `Bearer invalidAccessToken`);
        (0, utils_1.expect)(response.statusCode).to.be.equal(401);
        response = yield utils_1.request
            .get('/v1/api/account/my-account')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ email, password });
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
        (0, utils_1.expect)(response.body.user.id).to.be.greaterThan(0);
        (0, utils_1.expect)(response.body.user.email).to.be.equal(email);
    }));
    it("POST /v1/api/account/password-reset should send an email", () => __awaiter(void 0, void 0, void 0, function* () {
        let email = utils_1.chance.email();
        let password = utils_1.chance.word();
        var response = yield utils_1.request
            .post('/v1/api/account/register')
            .send({ email, password });
        utils_1.spy.on(passwords, ['sendPasswordResetEmail']);
        response = yield utils_1.request
            .post('/v1/api/account/password-reset')
            .send({ email });
        (0, utils_1.expect)(passwords.sendPasswordResetEmail).to.have.been.called.with(email);
        (0, utils_1.expect)(response.statusCode).to.be.equal(200);
    }));
}));
//# sourceMappingURL=invoices_test.js.map