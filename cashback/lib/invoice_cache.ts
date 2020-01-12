import { logger } from './logger';

const invoices = {}

// Configure the cache expiry via environment variable
// CACHE_EXPIRY_MILLISECONDS=10000 by default
var CACHE_EXPIRY_MILLISECONDS = (() => {

	if (process.env.CACHE_EXPIRY_MILLISECONDS) {

		return parseInt(process.env.CACHE_EXPIRY_MILLISECONDS)

	} else {

		return 10000
	}
})()

function configureCacheExpiry(milliseconds: number) {
	logger.info('reconfiguring cache expiry', milliseconds)
	CACHE_EXPIRY_MILLISECONDS = milliseconds
}

async function getInvoice(uid): Promise<boolean> {
	if (invoices[uid]) {
		return true
	} else {
		return false
	}

}

async function setInvoice(uid): Promise<number> {
	invoices[uid] = true
	logger.info('set invoice cache', uid)

	// expire cache after a set time
	setTimeout(() => {

		delete invoices[uid]
		logger.info('expired invoice cache', uid)

	}, CACHE_EXPIRY_MILLISECONDS);

  return CACHE_EXPIRY_MILLISECONDS;
}

async function ensureNotCached(uid: string): Promise<null> {

  const isInvoiceCached = await getInvoice(uid)

  if (isInvoiceCached) {

    throw new Error(`invoice ${uid} is already cached`);
  }

  await setInvoice(uid);

  return;
}

export {
  ensureNotCached,
  configureCacheExpiry,
  getInvoice,
  setInvoice
}

