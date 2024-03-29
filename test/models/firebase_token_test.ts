
import prisma from '../../lib/prisma';
import { chance, generateAccount } from '../utils';
import * as assert from 'assert';

describe("Firebase Token Model", () => {

  it("should persisnt a token associated with an account", async () => {

    let account = await generateAccount();

    const record = await prisma.firebase_tokens.create({
      data: {
        token: chance.word(),
        account_id: account.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    assert.strictEqual(record.account_id, account.id)
    assert(record.id > 0);

  });

});
