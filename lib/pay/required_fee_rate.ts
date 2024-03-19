
import { invoices as Invoice } from '@prisma/client'

import * as mempool from '../mempool.space'

import { config } from '../config'

/*
 * Required Fee Rate
 *
 * 1) Defaults to 1 satoshi per byte or equivalent on other architectures
 *
 * 2) May be statically set with an environment variable e.g. REQUIRED_FEE_RATE_ETH
 *
 * 3) May be set in custom function on a per-chain basis. Currently only BTC implemented
 *
 * 4) TODO: Refactor BTC-specific fee calculation into plugin.getRequiredFeeRate()
 *
 */

export async function getRequiredFeeRate({ chain, invoice }: {chain: string, invoice?: Invoice }): Promise<number> {

  var requiredFeeRate = 1

  const rate_env_variable = `REQUIRED_FEE_RATE_${chain}`

  const feeFromEnv = process.env[rate_env_variable]

  if (feeFromEnv) {

    requiredFeeRate = parseInt(feeFromEnv)

  }

  if (chain === 'BTC') {

    if (config.get('mempool_space_fees_enabled') && invoice?.fee_rate_level) {

      const level = mempool.FeeLevels[invoice.fee_rate_level as keyof typeof mempool.FeeLevels]

      requiredFeeRate = await mempool.getFeeRate(level || mempool.FeeLevels.fastestFee)

    }

  }

  return requiredFeeRate

}

