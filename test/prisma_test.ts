
// mocha test for testing registering a new account using the prisma model

import { expect } from 'chai';
import { prisma } from '../lib/prisma'
import { faker } from '@faker-js/faker';
describe("Registring an Account using prisma", () => {

    it('should create a record in the database', async () => {

        // generate a random email address using a library
        const randomEmail = faker.internet.email()

        const newAccount = await prisma.accounts.create({
            data: {
                email: "",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        expect(newAccount).to.be.a('number')
        expect(newAccount).to.be.a('email')
        expect(newAccount).to.be.a('createdAt')
        expect(newAccount).to.be.a('updatedAt')

    });

})
