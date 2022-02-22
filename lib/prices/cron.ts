
import { logInfo, logError } from '../logger'

import { setAllFiatPrices, setAllCryptoPrices } from './'

var fiatInterval, cryptoInterval;

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;

export async function start() {

  logInfo('prices.cron.start')

  fiatInterval = setInterval(async () => {

    try {

      await setAllFiatPrices()

    } catch(error) {

      logError('prices.cron.fiat.error', error)

    }

  }, ONE_HOUR)

  await setAllFiatPrices()

  cryptoInterval = setInterval(async () => {

    try {

      setAllCryptoPrices()

    } catch(error) {

      logError('prices.cron.crypto.error', error)

    }

  }, ONE_MINUTE)

  setAllCryptoPrices()
}

export async function stop() {

  if (fiatInterval) { clearInterval(fiatInterval) }

  if (cryptoInterval) { clearInterval(cryptoInterval) }

}
