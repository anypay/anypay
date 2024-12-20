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
import { log } from '@/lib/log'

export var feesRecommended: {
  [key: string]: number
} = {}

import axios from 'axios'

async function updateFeesRecommended() {

  try {

    feesRecommended = await getFeesRecommended();

    log.debug('mempool.space.feesRecommended.updated', feesRecommended)

  } catch(error: any) {

    log.error('mempool.space.feesRecommended', error)

  }

};

export async function getFeesRecommended() {

  const { data } = await axios.get('https://mempool.space/api/v1/fees/recommended')

  return data

}

export enum FeeLevels {
  fastestFee = 'fastestFee',
  halfHourFee = 'halfHourFee',
  hourFee = 'hourFee',
  economyFee = 'economyFee',
  minimumFee = 'minimumFee',
}

export async function getFeeRate(level: FeeLevels | string) {
  return feesRecommended[level]

}

updateFeesRecommended()

setInterval(() => {

  updateFeesRecommended()

},1000 * 60)

