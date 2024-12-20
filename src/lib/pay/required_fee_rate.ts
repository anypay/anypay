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
import { invoices as Invoice } from '@prisma/client'

import * as mempool from '@/lib/mempool.space'

import { config } from '@/lib/config'

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

  const feeFromEnv = config.get(rate_env_variable)

  if (feeFromEnv) {

    requiredFeeRate = parseInt(feeFromEnv)

  }

  if (chain === 'BTC') {

    if (config.get('MEMPOOL_SPACE_FEES_ENABLED') && invoice?.fee_rate_level) {

      const level = mempool.FeeLevels[invoice.fee_rate_level as keyof typeof mempool.FeeLevels]

      requiredFeeRate = await mempool.getFeeRate(level || mempool.FeeLevels.fastestFee)

    }

  }

  return requiredFeeRate

}

