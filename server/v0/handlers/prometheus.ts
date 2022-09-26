
import { prometheus } from '../../../lib/prometheus'

export async function show(req, h) {

  const metrics = await prometheus.register.metrics()

  const { contentType } = prometheus.register

  return h.response(metrics).type(contentType);

}

