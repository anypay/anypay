
import mempoolJS from "@mempool/mempool.js";

import { log } from './log'

export var feesRecommended = {}

const { bitcoin: { fees } } = mempoolJS({
  hostname: 'mempool.space'
});

async function updateFeesRecommended() {

  try {

    feesRecommended = await fees.getFeesRecommended();

    log.debug('mempool.space.feesRecommended.updated', feesRecommended)

  } catch(error) {

    log.error('mempool.space.feesRecommended', error)

  }

};

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

