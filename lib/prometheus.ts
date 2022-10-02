
import * as prometheus from 'prom-client'

const collectDefaultMetrics = prometheus.collectDefaultMetrics

collectDefaultMetrics({ prefix: 'anypay_' })

export { prometheus }

const histograms = { }

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

