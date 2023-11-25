
import { prometheus } from '../../../lib/prometheus'

export async function show(req, h) {

  console.log('prometheus.show', req.params)

  return h
    .response(await prometheus.register.metrics())
    .type(prometheus.register.contentType);

}

