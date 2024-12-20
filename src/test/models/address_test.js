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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const lib_1 = require("@/lib");
const assert_1 = __importDefault(require("assert"));
const chance_1 = __importDefault(require("chance"));
const prisma_1 = __importDefault(require("@/lib/prisma"));
const chance = new chance_1.default();
describe('Address Model', () => {
    it("should have an account, currency, value", () => __awaiter(void 0, void 0, void 0, function* () {
        let account = yield lib_1.accounts.registerAccount(chance.email(), chance.word());
        const address = yield prisma_1.default.addresses.create({
            data: {
                account_id: account.id,
                value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9',
                currency: 'DASH',
                chain: 'DASH',
                locked: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        (0, assert_1.default)(address.id > 0);
        (0, assert_1.default)(address.locked);
    }));
});
//# sourceMappingURL=address_test.js.map