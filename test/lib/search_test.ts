
require('dotenv').config();

import * as search from '../../lib/search'

import { searchInvoiceExternalId, searchInvoiceHash, searchAccountEmail, searchInvoiceUid } from '../../lib/search'

import { expect, spy } from '../utils';

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

        const invoice_uid = ''
        
        const [result] = await search.search(invoice_uid)

        expect(result.type).to.be.equal('invoice')

        expect(result.value.uid).to.be.equal(invoice_uid)

    })

    it('should search for and return an invoice by external id', async  () => {

        const external_id = ''
        
        const [result] = await search.search(external_id)

        expect(result.type).to.be.equal('invoice')

        expect(result.value.external_id).to.be.equal(external_id)

    })

    it('should search for and return an invoice by hash', async  () => {

        const hash = ''
        
        const [result] = await search.search(hash)

        expect(result.type).to.be.equal('invoice')

        expect(result.value.hash).to.be.equal(hash)

    })

    it('should search for and return an account by email', async  () => {

        const email = ''
        
        const [result] = await search.search(email)

        expect(result.type).to.be.equal('account')

        expect(result.value.email).to.be.equal(email)

    })

});
