
import { log } from './log'

export var feesRecommended = {}

import axios from 'axios'

async function updateFeesRecommended() {

  try {

    feesRecommended = await getFeesRecommended();

    log.debug('mempool.space.feesRecommended.updated', feesRecommended)

  } catch(error) {

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

