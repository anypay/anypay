
import { log } from '../log'

import { setAllFiatPrices, setAllCryptoPrices } from './'

var fiatInterval: NodeJS.Timeout, cryptoInterval: NodeJS.Timeout;

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;

export async function start() {

  log.info('prices.cron.start')

  fiatInterval = setInterval(async () => {

    try {

      await setAllFiatPrices()

    } catch(error: any) {

      log.error('prices.cron.fiat.error', error)

    }

  }, ONE_HOUR)

  await setAllFiatPrices()

  cryptoInterval = setInterval(async () => {

    try {

      setAllCryptoPrices()

    } catch(error: any) {

      log.error('prices.cron.crypto.error', error)

    }

  }, ONE_MINUTE)

  setAllCryptoPrices()
}

export async function stop() {

  if (fiatInterval) { clearInterval(fiatInterval) }

  if (cryptoInterval) { clearInterval(cryptoInterval) }

}
