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

import { config } from '@/lib/config';
import { log } from '@/lib/log'

import { setAllFiatPrices, setAllCryptoPrices } from './'

var fiatInterval: Timer, cryptoInterval: Timer;

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;

export async function start() {

  log.info('prices.cron.start')

  if (config.get('ANYPAY_FIXER_ACCESS_KEY')) {

    console.log("Setting fiat prices")

    fiatInterval = setInterval(async () => {

      try {

        await setAllFiatPrices()

      } catch(error: any) {

        log.error('prices.cron.fiat.error', error)

      }

    }, ONE_HOUR)
    
  }

  try {

    await setAllFiatPrices()

  } catch(error: any) {

    log.error('prices.cron.fiat.error', error)

  }

  console.log("Setting crypto prices")

  try  {

    cryptoInterval = setInterval(async () => {

      try {

        setAllCryptoPrices()

      } catch(error: any) {

        log.error('prices.cron.crypto.error', error)

      }

    }, ONE_MINUTE)
    

  } catch(error: any) {

    log.error('prices.cron.cryptoInterval.error', error)

 
  }


  try {

    setAllCryptoPrices()

  } catch(error: any) {

    log.error('prices.cron.crypto.error', error)

  }

}

export async function stop() {

  if (fiatInterval) { clearInterval(fiatInterval) }

  if (cryptoInterval) { clearInterval(cryptoInterval) }

}
