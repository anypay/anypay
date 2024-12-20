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
require("dotenv").config();
const prisma_1 = __importDefault(require("@/lib/prisma"));
const assert = require('assert');
const Chance = require('chance');
const chance = new Chance();
describe('Account Model', () => {
    it("should store the default denomination currency", () => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield prisma_1.default.accounts.create({
            data: {
                email: chance.email(),
                denomination: 'VEF',
                updatedAt: new Date(),
                createdAt: new Date()
            }
        });
        assert(account.id > 0);
        assert.strictEqual(account.denomination, 'VEF');
    }));
});
//# sourceMappingURL=account_test.js.map