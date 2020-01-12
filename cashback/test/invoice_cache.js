const assert = require("assert")
const uuid = require("uuid").v4
const InvoiceCache = require('../lib/invoice_cache')

describe("InvoiceCache", () => {

	it("getInvoice should return false with no invoice set", async () => {
		let invoiceUid = uuid()

		let isInvoicePaid = await InvoiceCache.getInvoice(invoiceUid)

		assert(!isInvoicePaid)
	})
	
	it("setInvoice should cause getInvoice to return true", async () => {
		let invoiceUid = uuid()

		await InvoiceCache.setInvoice(invoiceUid)

		let isInvoicePaid = await InvoiceCache.getInvoice(invoiceUid)

		assert(isInvoicePaid)
	})

	it("setInvoice should expire after a configurable time", async () => {
		let invoiceUid = uuid()

		InvoiceCache.configureCacheExpiry(200) // 0.2 seconds

		await InvoiceCache.setInvoice(invoiceUid)
		let isInvoicePaid = await InvoiceCache.getInvoice(invoiceUid)

		assert(isInvoicePaid)
			
		await wait(300)

		isInvoicePaid = await InvoiceCache.getInvoice(invoiceUid)

		assert(!isInvoicePaid)
	})
})

function wait(milliseconds) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, milliseconds)
	})
}

