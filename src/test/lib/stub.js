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
const assert = __importStar(require("assert"));
const stub = __importStar(require("@/lib/stub"));
const utils = __importStar(require("@test/utils"));
const prisma_1 = __importDefault(require("@/lib/prisma"));
describe("Adding a stub to an account", () => {
    it("should use the business name by default", () => {
        var accountStub = stub.build({ business_name: 'La Carreta' });
        assert.strictEqual(accountStub, 'la-carreta');
        accountStub = stub.build({
            business_name: 'La Carreta',
            city: 'Portsmouth'
        });
        assert.strictEqual(accountStub, 'la-carreta-portsmouth');
    });
    it("should automatically update the stub on the model", () => __awaiter(void 0, void 0, void 0, function* () {
        let account = yield utils.generateAccount();
        account.business_name = "Jason's Deli";
        yield prisma_1.default.accounts.update({
            where: {
                id: account.id
            },
            data: {
                business_name: "Jason's Deli",
                updatedAt: new Date()
            }
        });
        assert.strictEqual(account.stub, 'jasons-deli');
        yield prisma_1.default.accounts.delete({
            where: {
                id: account.id
            }
        });
    }));
    it("should prevent saving the stub if one with that stub already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        let account1 = yield utils.generateAccount();
        let account2 = yield utils.generateAccount();
        account1.business_name = "HEB Supermarket";
        account2.business_name = "HEB Supermarket";
        yield prisma_1.default.accounts.update({
            where: {
                id: account1.id
            },
            data: {
                business_name: "HEB Supermarket",
                updatedAt: new Date()
            }
        });
        assert.strictEqual(account1.stub, 'heb-supermarket');
        yield prisma_1.default.accounts.update({
            where: {
                id: account2.id
            },
            data: {
                business_name: "HEB Supermarket",
                updatedAt: new Date()
            }
        });
        assert.strictEqual(account2.stub, null);
        yield prisma_1.default.accounts.delete({
            where: {
                id: account1.id
            }
        });
        yield prisma_1.default.accounts.delete({
            where: {
                id: account2.id
            }
        });
    }));
    it("should try to use the city in case of a conflict", () => __awaiter(void 0, void 0, void 0, function* () {
        let account1 = yield utils.generateAccount();
        let account2 = yield utils.generateAccount();
        account1.business_name = "HEB Supermarket";
        account2.business_name = "HEB Supermarket";
        account2.city = "San Antonio";
        yield prisma_1.default.accounts.update({
            where: {
                id: account1.id
            },
            data: {
                business_name: "HEB Supermarket",
                updatedAt: new Date()
            }
        });
        assert.strictEqual(account1.stub, 'heb-supermarket');
        yield prisma_1.default.accounts.update({
            where: {
                id: account2.id
            },
            data: {
                business_name: "HEB Supermarket",
                city: "San Antonio",
                updatedAt: new Date()
            }
        });
        assert.strictEqual(account2.stub, 'heb-supermarket-san-antonio');
        yield prisma_1.default.accounts.delete({
            where: {
                id: account1.id
            }
        });
        yield prisma_1.default.accounts.delete({
            where: {
                id: account2.id
            }
        });
    }));
});
//# sourceMappingURL=stub.js.map