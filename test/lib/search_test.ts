
require('dotenv').config();

import prisma from '../../lib/prisma';
import * as search from '../../lib/search'

import { searchInvoiceExternalId, searchInvoiceHash, searchAccountEmail, searchInvoiceUid } from '../../lib/search'

import { expect, spy, newInvoice, account } from '../utils';

describe("Search", () => {

    it('#search should call multiple sub-searches', async () => {

        spy.on(search, 'searchInvoiceExternalId')
        spy.on(search, 'searchInvoiceHash')
        spy.on(search, 'searchAccountEmail')
        spy.on(search, 'searchInvoiceUid')

        await search.search('12345')

        expect(searchInvoiceExternalId).to.be.called
        expect(searchInvoiceHash).to.be.called
        expect(searchAccountEmail).to.be.called
        expect(searchInvoiceUid).to.be.called

    })

    it('should search for and return an invoice by uid', async  () => {

        let invoice = await newInvoice({ amount: 5.25, account })
        
        const [result] = await search.search(invoice.uid)

        expect(result.type).to.be.equal('invoice')

        expect(result.value.uid).to.be.equal(invoice.uid)

    })

    it.skip('should search for and return an invoice by external id', async  () => {

        const external_id = '12345'
        
        let invoice = await newInvoice({ amount: 5.25, account })

        await prisma.invoices.update({
            where: {
                id: invoice.id
            },
            data: {
                external_id
            }            
        })

        const [result] = await search.search(external_id)

        expect(result.type).to.be.equal('invoice')

        expect((result.value as any).external_id).to.be.equal(external_id)

    })

    it.skip('should search for and return an invoice by hash', async  () => {

        const hash = ''
        
        const [result] = await search.search(hash)

        expect(result.type).to.be.equal('invoice')

        expect((result.value as any).hash).to.be.equal(hash)

    })

    it.skip('should search for and return an account by email', async  () => {

        const email = ''
        
        const [result] = await search.search(email)

        expect(result.type).to.be.equal('account')

        expect(result.value.email).to.be.equal(email)

    })

});
