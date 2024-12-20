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
const prisma_1 = __importDefault(require("@/lib/prisma"));
const utils_1 = require("@test/utils");
describe("Firebase Token Model", () => {
    it("should persisnt a token associated with an account", () => __awaiter(void 0, void 0, void 0, function* () {
        let account = yield (0, utils_1.generateAccount)();
        const record = yield prisma_1.default.firebase_tokens.create({
            data: {
                token: utils_1.chance.word(),
                account_id: account.id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        utils_1.assert.strictEqual(record.account_id, account.id);
        (0, utils_1.assert)(record.id > 0);
    }));
});
//# sourceMappingURL=firebase_token_test.js.map