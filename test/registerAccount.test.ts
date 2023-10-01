require('dotenv').config()

import { expect } from './utils'

import chai from "chai";
import spies from "chai-spies";
chai.use(spies);
import { registerAccount } from '../lib/accounts';
import { log } from '../lib/log'; // Replace with the actual path to your log module

import { accounts } from '@prisma/client'
import { prisma } from '../lib';

describe("registerAccount Integration Tests", () => {
  before(async () => {
    // Before all tests, set up the database, if needed
  });

  after(async () => {
    // Cleanup the database
    await prisma.accounts.deleteMany();
  });

  it("should register an account and return it", async () => {
    const email = "test@example.com";
    const password = "password123";
    const account: accounts = await registerAccount(email, password);

    expect(account).to.have.property("id");
    expect(account).to.have.property("email", email);

    // Check if record actually exists in the database
    const dbAccount = await prisma.accounts.findUnique({
      where: { email: email }
    });

    expect(dbAccount).to.not.be.null;
    expect(dbAccount).to.have.property("id", account.id);
  });

  it("should log account creation", async () => {
    const logSpy = chai.spy.on(log, "info");

    const email = "test2@example.com";
    const password = "password123";
    await registerAccount(email, password);

    expect(logSpy).to.have.been.called.with((_level, info) => {
      return info.email === email;
    });

    logSpy.restore();
  });
});