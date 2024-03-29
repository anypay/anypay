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
import * as prometheus from 'prom-client'

const collectDefaultMetrics = prometheus.collectDefaultMetrics

collectDefaultMetrics({ prefix: 'anypay_' })

export { prometheus }

const histograms: {
  [key: string]: prometheus.Histogram<any>
} = { }

export function getHistogram({ method, path }: {method: String, path: String}): prometheus.Histogram<any> {

  path = path.split('/').join('_')

  let key = `${method}_${path}`

  const name = `anypay_api_request_${method}__${path}`

  if (!histograms[key]) {

    histograms[key] = new prometheus.Histogram({
      name,
      help: 'Duration of HTTP Request in ms',
      //labelNames: ['status_code'],
      buckets: [0.1, 5, 15, 50, 100, 500]
    })
  }

  return histograms[key]

}

