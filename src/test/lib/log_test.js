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
const log_1 = require("@/lib/log");
const amqp = __importStar(require("@/lib/amqp"));
describe("lib/log.ts", () => {
    it('should be constructed with option to override environment', () => __awaiter(void 0, void 0, void 0, function* () {
        const logger = new log_1.Logger({ env: 'development' });
        logger.info('test.log.info', {});
        logger.debug('test.log.debug', {});
        logger.error('test.log.debug', new Error());
    }));
    it('should log info', () => {
        log_1.log.info('test.log.info', {});
    });
    it('should re-publish message to account amqp topic when account_id is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const logger = new log_1.Logger({ env: 'development' });
        utils_1.spy.on(amqp, ['publish']);
        logger.info('test.log.info', {
            account_id: 52
        });
        (0, utils_1.expect)(amqp.publish).to.have.been.called;
    }));
    it('should re-publish message to invoice amqp topic when account_id is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const logger = new log_1.Logger({ env: 'development' });
        utils_1.spy.on(amqp, ['publish']);
        logger.info('test.log.info', {
            invoice_uid: 'ghdielkske'
        });
        (0, utils_1.expect)(amqp.publish).to.have.been.called;
    }));
    it('should log debug', () => {
        log_1.log.debug('test.log.debug', {});
    });
    it('should log error', () => {
        log_1.log.error('test.log.error', new Error());
    });
    it('#read should read messages from the log', () => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield log_1.log.read({
            type: 'test.log.info'
        });
        (0, utils_1.expect)(results).to.be.an('array');
    }));
    it('should log a payload object that has a toJSON function', () => __awaiter(void 0, void 0, void 0, function* () {
        const object = { toJSON: () => { } };
        utils_1.spy.on(object, ['toJSON']);
        log_1.log.info('to.json', object);
        (0, utils_1.expect)(object.toJSON).to.have.been.called;
    }));
});
//# sourceMappingURL=log_test.js.map